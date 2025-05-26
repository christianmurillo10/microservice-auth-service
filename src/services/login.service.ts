import { v4 as uuidv4 } from "uuid";
import UsersModel from "../models/users.model";
import { MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS, MESSAGE_NOT_IMPLEMENTED } from "../shared/constants/message.constant";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { addDaysToDate, addMinutesToDate } from "../shared/helpers/common.helper";
import { generateAccessToken } from "../shared/helpers/jwt.helper";
import { comparePassword } from "../shared/utils/bcrypt";
import SessionsService from "./sessions.service";
import UsersService from "./users.service";

type Input = {
  access_type?: string,
  email: string,
  password: string
};

type Output = {
  record: UsersModel,
  result: {
    user_id: string,
    token: string,
    expiration: Date,
    refresh_token: string
  }
};

export default class LoginService {
  private input: Input;
  private record: UsersModel | undefined;

  constructor(input: Input) {
    this.input = input;
  };

  private setRecord = async () => {
    switch (this.input.access_type) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        const usersService = new UsersService();
        this.record = await usersService.getByUsernameOrEmail(this.input.email)
          .catch(err => {
            if (err instanceof NotFoundException) {
              throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
            }

            throw err;
          });
        this.input.access_type = this.record.access_type;
        break;
    };
  };

  private saveSession = async (access_token: string, user_id: string) => {
    const sessionService = new SessionsService();
    return await sessionService.save({
      access_type: this.record!.access_type,
      access_token,
      refresh_token: uuidv4(),
      user_id,
      refresh_token_expires_at: addDaysToDate(new Date(), 30),
      created_at: new Date(),
      updated_at: new Date()
    });
  };

  execute = async (): Promise<Output> => {
    await this.setRecord();
    
    if (!this.record) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
    };

    const validatePassword = comparePassword(this.input.password, this.record.password as string);
    if (!validatePassword) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
    };

    // Generate Access Token
    const accessTokenExpiryDate = addMinutesToDate(new Date(), 30);
    const accessTokenExpiry = accessTokenExpiryDate.getTime() / 1000;
    const accessToken = generateAccessToken(this.record.access_type, this.record, accessTokenExpiry);
    const session = await this.saveSession(accessToken, this.record.id as string);

    return {
      record: this.record,
      result: {
        user_id: session.user_id,
        token: session.access_token,
        expiration: accessTokenExpiryDate,
        refresh_token: session.refresh_token
      }
    };
  };
};