import { v4 as uuidv4 } from "uuid";
import { UsersAccessType } from "../entities/users.entity";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_TOKEN_EXPIRED } from "../shared/constants/message.constant";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { addDaysToDate, addMinutesToDate } from "../shared/helpers/common.helper";
import { generateAccessToken, verifyToken } from "../shared/helpers/jwt.helper";
import SessionsService from "./sessions.service";
import UsersService from "./users.service";
import SessionsModel from "../models/sessions.model";

type Input = {
  token: string,
  refresh_token: string
};

type Output = {
  user_id: string,
  token: string,
  expiration: Date,
  refresh_token: string
};

export default class TokenService {
  private input: Input;
  private sessionsService: SessionsService;
  private usersService: UsersService;

  constructor(input: Input) {
    this.input = input;
    this.sessionsService = new SessionsService();
    this.usersService = new UsersService();
  };

  private validateRefreshToken = async (session: SessionsModel) => {
    const refreshTokenExpiryDate = new Date(session.refresh_token_expires_at);
    const currentDate = new Date();
    if (refreshTokenExpiryDate < currentDate) {
      await this.sessionsService.delete(session.id!);
      throw new UnauthorizedException([MESSAGE_DATA_TOKEN_EXPIRED]);
    }
  };

  execute = async (): Promise<Output> => {
    const tokenData = verifyToken(this.input.token);

    if (
      !tokenData ||
      tokenData.client !== UsersAccessType.Portal &&
      tokenData.client !== UsersAccessType.Business
    ) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    const session = await this.sessionsService.getByRefreshToken(this.input.refresh_token);
    if (session.access_token !== this.input.token) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    }

    // Validate if refresh token date was expired
    await this.validateRefreshToken(session);

    // Generate Access Token
    const record = await this.usersService.getById(tokenData.id as unknown as string);
    const accessTokenExpiryDate = addMinutesToDate(new Date(), 30);
    const accessTokenExpiry = accessTokenExpiryDate.getTime() / 1000;
    const accessToken = generateAccessToken(tokenData.client, record, accessTokenExpiry);

    // Save data to sessions table
    session.access_token = accessToken;
    session.refresh_token = uuidv4();
    session.refresh_token_expires_at = addDaysToDate(new Date(), 30);
    await this.sessionsService.save(session);

    return {
      user_id: session.user_id,
      token: session.access_token,
      expiration: accessTokenExpiryDate,
      refresh_token: session.refresh_token
    };
  };
};