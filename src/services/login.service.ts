import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/user.model";
import UserRequestHeaderModel from "../models/user-request-header.model";
import { MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS, MESSAGE_DATA_NOT_IMPLEMENTED } from "../shared/constants/message.constant";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { addDaysToDate, addMinutesToDate } from "../shared/helpers/common.helper";
import { generateAccessToken } from "../shared/helpers/jwt.helper";
import { comparePassword } from "../shared/utils/bcrypt";
import SessionService from "./session.service";
import UserService from "./user.service";
import BuildUserPermissionsService from "./rbac/build-user-permissions.service";
import { UserAccessTypeValue } from "../entities/user.entity";
import UserKafkaProducer from "../events/producer/user.producer";

type State = {
  input: {
    accessType?: string,
    email: string,
    password: string,
  }
  userRequestHeader: UserRequestHeaderModel
};

type Output = {
  userId: string,
  organizationId?: string,
  token: string,
  expiration: Date,
  refreshToken: string
};

export default class LoginService {
  private state: State;

  constructor(state: State) {
    this.state = state;
  };

  private validatePassword = async (password: string, hashPassword: string) => {
    const validatePassword = comparePassword(password, hashPassword);

    if (!validatePassword) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
    };
  };

  private getUser = async (userService: UserService, email: string): Promise<UserModel> => {
    try {
      return userService.getByUsernameOrEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
      throw error;
    }
  };

  private updateUser = async (userService: UserService, user: UserModel, loggedDate: Date) => userService
    .save({
      ...user,
      isLogged: true,
      lastLoggedAt: loggedDate
    });

  private getAccessToken = (
    id: number,
    email: string,
    accessType: UserAccessTypeValue,
    subject: number,
    loggedDate: Date
  ) => {
    const accessTokenExpiryDate = addMinutesToDate(loggedDate, 30);
    const accessTokenExpiry = accessTokenExpiryDate.getTime() / 1000;
    const accessToken = generateAccessToken(
      id,
      email,
      accessType,
      subject,
      accessTokenExpiry
    );
    return { accessTokenExpiryDate, accessToken };
  };

  private createSession = async (
    accessToken: string,
    accessType: UserAccessTypeValue,
    userId: string
  ) => {
    const sessionService = new SessionService();
    return await sessionService.save({
      accessType: accessType,
      accessToken,
      refreshToken: uuidv4(),
      userId,
      refreshTokenExpiresAt: addDaysToDate(new Date(), 30),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  private userUpdates = async (): Promise<Output> => {
    const { input, userRequestHeader } = this.state;
    const { email, password } = input;
    const loggedDate = new Date();
    const userService = new UserService();
    const record = await this.getUser(userService, email);

    // Validate password
    await this.validatePassword(password, record.password as string);

    // User updates
    const newRecord = await this.updateUser(userService, record, loggedDate);


    // Build and cache permissions in Redis
    const buildUserPermissionsService = new BuildUserPermissionsService({
      userId: newRecord.id as string,
      organizationId: newRecord.organizationId as string
    });
    await buildUserPermissionsService.execute();

    // Generate access token and create session
    const { accessTokenExpiryDate, accessToken } = this.getAccessToken(
      newRecord.id as unknown as number,
      newRecord.email,
      newRecord.accessType,
      newRecord.organizationId as unknown as number,
      loggedDate
    );
    const session = await this.createSession(accessToken, record.accessType, record.id as string);

    // Send to Kafka
    const userProducer = new UserKafkaProducer();
    await userProducer.userLoggedInEventEmitter(
      {
        oldDetails: {
          id: record.id!,
          isLogged: record.isLogged,
          lastLoggedAt: record.lastLoggedAt!,
          updatedAt: record.updatedAt
        },
        newDetails: {
          id: record.id!,
          isLogged: newRecord.isLogged,
          lastLoggedAt: newRecord.lastLoggedAt!,
          updatedAt: record.updatedAt
        }
      },
      record.id!,
      {
        ipAddress: userRequestHeader.ipAddress ?? undefined,
        host: userRequestHeader.host ?? undefined,
        userAgent: userRequestHeader.userAgent ?? undefined
      }
    );

    return {
      userId: session.userId,
      organizationId: newRecord.organizationId ?? undefined,
      token: session.accessToken,
      expiration: accessTokenExpiryDate,
      refreshToken: session.refreshToken
    };
  };

  execute = async (): Promise<Output> => {
    switch (this.state.input.accessType) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_DATA_NOT_IMPLEMENTED]);
      default:
        return await this.userUpdates();
    };
  };
};