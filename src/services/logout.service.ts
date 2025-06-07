import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_NOT_IMPLEMENTED } from "../shared/constants/message.constant";
import SessionsService from "./sessions.service";
import UsersService from "./users.service";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import UserRequestHeaderModel from "../models/user-request-header.model";
import SessionsModel from "../models/sessions.model";
import UsersModel from "../models/users.model";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import UserKafkaProducer from "../events/producer/user.producer";

type Input = {
  token: string,
  userRequestHeader: UserRequestHeaderModel
};

export default class LogoutService {
  private input: Input;
  private sessionsService: SessionsService;

  constructor(input: Input) {
    this.input = input;
    this.sessionsService = new SessionsService();
  };

  private getSession = async (token: string): Promise<SessionsModel> => this.sessionsService
    .getByAccessToken(token)
    .catch(err => {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      };

      throw err;
    });

  private getUser = async (usersService: UsersService, userId: string): Promise<UsersModel> => usersService
    .getById(userId)
    .catch(err => {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      }

      throw err;
    });

  private updateUser = async (usersService: UsersService, user: UsersModel) => usersService
    .save({
      ...user,
      is_logged: false
    });

  private userUpdates = async (session: SessionsModel) => {
    // Users updates
    const usersService = new UsersService();
    const record = await this.getUser(usersService, session.user_id);
    const newRecord = await this.updateUser(usersService, record);

    // Execute producer
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserLoggedOut(
      {
        old_details: {
          id: record.id!,
          is_logged: record.is_logged
        },
        new_details: {
          id: record.id!,
          is_logged: newRecord.is_logged
        }
      },
      record.id!,
      {
        ip_address: this.input.userRequestHeader.ip_address ?? undefined,
        host: this.input.userRequestHeader.host ?? undefined,
        user_agent: this.input.userRequestHeader.user_agent ?? undefined
      }
    );
  };

  execute = async (): Promise<void> => {
    const session = await this.getSession(this.input.token);
    await this.sessionsService.delete(session.id as string);

    switch (session.access_type) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        await this.userUpdates(session);
        break;
    };
  };
};