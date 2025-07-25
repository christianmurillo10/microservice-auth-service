import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_NOT_IMPLEMENTED } from "../shared/constants/message.constant";
import SessionService from "./session.service";
import UserService from "./user.service";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import UserRequestHeaderModel from "../models/user-request-header.model";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import UserKafkaProducer from "../events/producer/user.producer";

type State = {
  token: string,
  userRequestHeader: UserRequestHeaderModel
};

export default class LogoutService {
  private state: State;
  private sessionService: SessionService;

  constructor(state: State) {
    this.state = state;
    this.sessionService = new SessionService();
  };

  private getSession = async (token: string): Promise<SessionModel> => this.sessionService
    .getByAccessToken(token)
    .catch(err => {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      };

      throw err;
    });

  private getUser = async (userService: UserService, userId: string): Promise<UserModel> => userService
    .getById(userId)
    .catch(err => {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      }

      throw err;
    });

  private updateUser = async (userService: UserService, user: UserModel) => userService
    .save({
      ...user,
      isLogged: false
    });

  private userUpdates = async (session: SessionModel) => {
    // User updates
    const userService = new UserService();
    const record = await this.getUser(userService, session.userId);
    const newRecord = await this.updateUser(userService, record);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userLoggedOutEventEmitter(
      {
        oldDetails: {
          id: record.id!,
          isLogged: record.isLogged,
          updatedAt: record.updatedAt
        },
        newDetails: {
          id: record.id!,
          isLogged: newRecord.isLogged,
          updatedAt: record.updatedAt
        }
      },
      record.id!,
      {
        ipAddress: this.state.userRequestHeader.ipAddress ?? undefined,
        host: this.state.userRequestHeader.host ?? undefined,
        userAgent: this.state.userRequestHeader.userAgent ?? undefined
      }
    );
  };

  execute = async (): Promise<void> => {
    const session = await this.getSession(this.state.token);
    await this.sessionService.delete(session.id as string);

    switch (session.accessType) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        await this.userUpdates(session);
        break;
    };
  };
};