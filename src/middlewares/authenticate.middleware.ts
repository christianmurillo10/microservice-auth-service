import { Request, Response, NextFunction } from "express";
import { MESSAGE_DATA_NOT_LOGGED, MESSAGE_INVALID_PARAMETER } from "../shared/constants/message.constant";
import AuthenticateService from "../services/authenticate.service";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import BadRequestException from "../shared/exceptions/bad-request.exception";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;
    const { organizationId } = req.params;

    if (!authorization) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    };

    if (organizationId === ":organizationId") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const authenticateService = new AuthenticateService({
      token: authorization.split(" ")[1],
      organizationId: organizationId
    });
    const authenticateOutput = await authenticateService.execute();

    if (authenticateOutput.organization) {
      req.organization = authenticateOutput.organization;
      req.body.organizationId = authenticateOutput.organization.id;
    }

    req.auth = authenticateOutput.user;
    next();
  } catch (error) {
    next(error);
  };
};

export default authenticate;