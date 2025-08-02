import { UserAccessType } from "../entities/user.entity";
import OrganizationModel from "../models/organization.model";
import UserModel from "../models/user.model";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED, MESSAGE_INVALID_ORGANIZATION, MESSAGE_REQUIRED_ORGANIZATION } from "../shared/constants/message.constant";
import ForbiddenException from "../shared/exceptions/forbidden.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { verifyToken } from "../shared/helpers/jwt.helper";
import OrganizationService from "./organization.service";
import UserService from "./user.service";

type Input = {
  token: string,
  organizationId?: string,
};

type Output = {
  organization?: OrganizationModel,
  user: UserModel
};

export default class AuthenticateService {
  private input: Input;
  private organizationService: OrganizationService
  private userService: UserService;

  constructor(input: Input) {
    this.input = input;
    this.userService = new UserService();
    this.organizationService = new OrganizationService();
  };

  private validateUserRecord = async (id: string) => {
    const userRecord = await this.userService.getById(id)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    return userRecord;
  };

  private validateOrganization = async (organizationId: string) => {
    const organizationRecord = await this.organizationService.getById(organizationId)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    return organizationRecord;
  };

  execute = async (): Promise<Output> => {
    const { token, organizationId } = this.input;
    let organizationRecord;
    const tokenData = verifyToken(token);

    if (!tokenData) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    // Validate user logged status
    const userRecord = await this.validateUserRecord(tokenData.id as unknown as string);

    if (!userRecord) {
      throw new NotFoundException([MESSAGE_INVALID_ORGANIZATION]);
    }

    if (Boolean(userRecord.isLogged) === false) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    }

    // Validate via organizationId if token client is ORGANIZATION
    if (tokenData.client === UserAccessType.Organization) {
      if (!organizationId) {
        throw new ForbiddenException([MESSAGE_REQUIRED_ORGANIZATION]);
      };

      organizationRecord = await this.validateOrganization(organizationId as string);

      if (!organizationRecord) {
        throw new NotFoundException([MESSAGE_INVALID_ORGANIZATION]);
      }
    }

    return {
      user: userRecord
    };
  };
};