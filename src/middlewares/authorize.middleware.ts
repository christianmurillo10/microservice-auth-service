import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { MESSAGE_DATA_NOT_AUTHORIZED } from "../shared/constants/message.constant";
import redisConfig from "../config/redis.config";
import BuildUserPermissionsService from "../services/rbac/build-user-permissions.service";

const authorize = (action: string, resource: string) =>
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const authId = req.auth.id;
      const organizationId = req.auth.organizationId;

      if (!authId || !organizationId) {
        throw new UnauthorizedException([MESSAGE_DATA_NOT_AUTHORIZED])
      }

      const cache = await redisConfig.get(`user_permissions:${authId}`);

      let permissions: Record<string, string[]> = {};

      if (cache) {
        permissions = JSON.parse(cache);
      } else {
        const buildUserPermissionsService = new BuildUserPermissionsService({
          userId: authId,
          organizationId,
          expireInMinutes: 30
        });
        await buildUserPermissionsService.execute();
      }

      if (!permissions || !permissions[resource] || !permissions[resource].includes(action)) {
        throw new UnauthorizedException([MESSAGE_DATA_NOT_AUTHORIZED]);
      }

      next();
    } catch (error) {
      next(error);
    };
  };

export default authorize;