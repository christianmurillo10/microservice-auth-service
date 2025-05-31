import { v4 as uuidv4 } from "uuid";
import UsersModel from "../models/users.model";
import UserRequestHeaderModel from "../models/user-request-header.model";
import { MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS, MESSAGE_NOT_IMPLEMENTED } from "../shared/constants/message.constant";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { addDaysToDate, addMinutesToDate } from "../shared/helpers/common.helper";
import { generateAccessToken } from "../shared/helpers/jwt.helper";
import { comparePassword } from "../shared/utils/bcrypt";
import SessionsService from "./sessions.service";
import UsersService from "./users.service";
import { UsersAccessTypeValue } from "../entities/users.entity";
import UserKafkaProducer from "../events/producer/user.producer";

type Input = {
  body: {
    access_type?: string,
    email: string,
    password: string,
  }
  userRequestHeader: UserRequestHeaderModel
};

type Output = {
  user_id: string,
  token: string,
  expiration: Date,
  refresh_token: string
};

export default class LoginService {
  private input: Input;

  constructor(input: Input) {
    this.input = input;
  };

  private validatePassword = async (password: string, hashPassword: string) => {
    const validatePassword = comparePassword(password, hashPassword);

    if (!validatePassword) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
    };
  };

  private getUser = async (usersService: UsersService, email: string): Promise<UsersModel> => usersService
    .getByUsernameOrEmail(email)
    .catch(err => {
      if (err instanceof NotFoundException) {
        throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
      }

      throw err;
    });

  private updateUser = async (usersService: UsersService, user: UsersModel, loggedDate: Date) => usersService
    .save({
      ...user,
      is_logged: true,
      last_logged_at: loggedDate
    });

  private getAccessToken = (
    id: number,
    email: string,
    accessType: UsersAccessTypeValue,
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
    access_token: string,
    access_type: UsersAccessTypeValue,
    user_id: string
  ) => {
    const sessionsService = new SessionsService();
    return await sessionsService.save({
      access_type: access_type,
      access_token,
      refresh_token: uuidv4(),
      user_id,
      refresh_token_expires_at: addDaysToDate(new Date(), 30),
      created_at: new Date(),
      updated_at: new Date()
    });
  };

  private userUpdates = async (): Promise<Output> => {
    const { body, userRequestHeader } = this.input;
    const { email, password } = body;
    const loggedDate = new Date();
    const usersService = new UsersService();
    const record = await this.getUser(usersService, email);

    // Validate password
    await this.validatePassword(password, record.password as string);

    // Users updates
    const newRecord = await this.updateUser(usersService, record, loggedDate);

    // Generate access token and create session
    const { accessTokenExpiryDate, accessToken } = this.getAccessToken(
      newRecord.id as unknown as number,
      newRecord.email,
      newRecord.access_type,
      newRecord.business_id as unknown as number,
      loggedDate
    );
    const session = await this.createSession(accessToken, record.access_type, record.id as string);

    // Execute producer
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserLoggedIn(
      {
        old_details: {
          id: record.id!,
          is_logged: record.is_logged,
          last_logged_at: record.last_logged_at!
        },
        new_details: {
          id: record.id!,
          is_logged: newRecord.is_logged,
          last_logged_at: newRecord.last_logged_at!
        }
      },
      {
        ip_address: userRequestHeader.ip_address ?? undefined,
        host: userRequestHeader.host ?? undefined,
        user_agent: userRequestHeader.user_agent ?? undefined
      }
    );

    return {
      user_id: session.user_id,
      token: session.access_token,
      expiration: accessTokenExpiryDate,
      refresh_token: session.refresh_token
    };
  };

  execute = async (): Promise<Output> => {
    switch (this.input.body.access_type) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        return await this.userUpdates();
    };
  };
};