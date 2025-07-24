import { v4 as uuidv4 } from "uuid";
import { UserAccessTypeValue } from "../entities/user.entity";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_TOKEN_EXPIRED } from "../shared/constants/message.constant";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { addDaysToDate, addMinutesToDate } from "../shared/helpers/common.helper";
import { generateAccessToken } from "../shared/helpers/jwt.helper";
import SessionService from "./session.service";
import UserService from "./user.service";
import SessionModel from "../models/session.model";

type State = {
  token: string,
  refreshToken: string
};

type Output = {
  userId: string,
  token: string,
  expiration: Date,
  refreshToken: string
};

export default class RefreshTokenService {
  private state: State;
  private sessionService: SessionService;
  private userService: UserService;

  constructor(state: State) {
    this.state = state;
    this.sessionService = new SessionService();
    this.userService = new UserService();
  };

  private validateRefreshToken = async (session: SessionModel) => {
    const refreshTokenExpiryDate = new Date(session.refreshTokenExpiresAt);
    const currentDate = new Date();
    if (refreshTokenExpiryDate < currentDate) {
      await this.sessionService.delete(session.id!);
      throw new UnauthorizedException([MESSAGE_DATA_TOKEN_EXPIRED]);
    }
  };

  private getUser = async (id: string) => this.userService
    .getById(id)
    .catch(err => {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      }

      throw err;
    });

  private getAccessToken = (
    id: number,
    email: string,
    accessType: UserAccessTypeValue,
    subject: number,
  ) => {
    const accessTokenExpiryDate = addMinutesToDate(new Date(), 30);
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

  execute = async (): Promise<Output> => {
    const session = await this.sessionService.getByRefreshToken(this.state.refreshToken);
    if (session.accessToken !== this.state.token) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    }

    // Validate if refresh token date was expired
    await this.validateRefreshToken(session);

    // Generate Access Token
    const record = await this.getUser(session.userId);
    const { accessTokenExpiryDate, accessToken } = this.getAccessToken(
      record.id as unknown as number,
      record.email,
      session.accessType,
      record.businessId as unknown as number,
    );

    // Save data to session table
    session.accessToken = accessToken;
    session.refreshToken = uuidv4();
    session.refreshTokenExpiresAt = addDaysToDate(new Date(), 30);
    await this.sessionService.save(session);

    return {
      userId: session.userId,
      token: session.accessToken,
      expiration: accessTokenExpiryDate,
      refreshToken: session.refreshToken
    };
  };
};