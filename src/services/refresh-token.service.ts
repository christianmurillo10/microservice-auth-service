import { v4 as uuidv4 } from "uuid";
import { UserAccessTypeValue } from "../models/user.model";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_TOKEN_EXPIRED } from "../shared/constants/message.constant";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { addDaysToDate, addMinutesToDate } from "../shared/helpers/common.helper";
import { generateAccessToken } from "../shared/helpers/jwt.helper";
import SessionService from "./session.service";
import UserService from "./user.service";
import BuildUserPermissionsService from "./rbac/build-user-permissions.service";

type State = {
  token: string,
  refreshToken: string
};

type Output = {
  userId: string,
  organizationId?: string,
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

  private getUser = async (id: string) => {
    try {
      return this.userService.getById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
      throw error;
    }
  };

  private getAccessToken = (
    id: number,
    email: string,
    accessType: UserAccessTypeValue,
    subject: number,
    expireInMinutes: number
  ) => {
    const accessTokenExpiryDate = addMinutesToDate(new Date(), expireInMinutes);
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
    if (session.isRefreshExpired()) {
      await this.sessionService.delete(session.id!);
      throw new UnauthorizedException([MESSAGE_DATA_TOKEN_EXPIRED]);
    }

    const expireInMinutes = 30;
    const record = await this.getUser(session.userId);

    // User updates
    record.markLoggedIn();
    await this.userService.update(record.id!, record);

    // Build and cache permissions in Redis
    const buildUserPermissionsService = new BuildUserPermissionsService({
      userId: record.id as string,
      expireInMinutes
    });
    await buildUserPermissionsService.execute();

    // Generate Access Token
    const { accessTokenExpiryDate, accessToken } = this.getAccessToken(
      record.id as unknown as number,
      record.email,
      session.accessType,
      record.organizationId as unknown as number,
      expireInMinutes
    );

    // Update data to session table
    const updatedSession = await this.sessionService.update(session.id!, {
      accessToken: accessToken,
      refreshToken: uuidv4(),
      refreshTokenExpiresAt: addDaysToDate(new Date(), 30)
    });

    return {
      userId: updatedSession.userId,
      organizationId: record.organizationId ?? undefined,
      token: updatedSession.accessToken,
      expiration: accessTokenExpiryDate,
      refreshToken: updatedSession.refreshToken
    };
  };
};