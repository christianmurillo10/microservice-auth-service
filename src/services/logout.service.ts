import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_IMPLEMENTED } from "../shared/constants/message.constant";
import SessionService from "./session.service";
import UserService from "./user.service";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import UserRequestHeaderEntity from "../entities/user-request-header.entity";
import SessionEntity from "../entities/session.entity";
import UserEntity from "../entities/user.entity";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import UserKafkaProducer from "../events/producer/user.producer";

type State = {
  token: string,
  userRequestHeader: UserRequestHeaderEntity
};

export default class LogoutService {
  private state: State;
  private sessionService: SessionService;

  constructor(state: State) {
    this.state = state;
    this.sessionService = new SessionService();
  };

  private getSession = async (token: string): Promise<SessionEntity> => {
    try {
      return this.sessionService.getByAccessToken(token)
    } catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      throw error;
    }
  };

  private getUser = async (userService: UserService, userId: string): Promise<UserEntity> => {
    try {
      return userService.getById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      throw error;
    }
  };

  private updateUser = async (userService: UserService, user: UserEntity) => userService
    .save({
      ...user,
      isLogged: false
    });

  private userUpdates = async (session: SessionEntity) => {
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
        throw new BadRequestException([MESSAGE_DATA_NOT_IMPLEMENTED]);
      default:
        await this.userUpdates(session);
        break;
    };
  };
};