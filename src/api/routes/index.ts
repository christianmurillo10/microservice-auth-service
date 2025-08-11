import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import authRoute from "./auth.route";
import organizationRoute from "./organization.route";
import roleRoute from "./role.route";
import permissionRoute from "./permission.route";
import rolePermissionRoute from "./role-permission.route";
import userPermissionRoute from "./user-permission.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    statusCode: 200,
    message: `Welcome to ${config.appName}`
  }).end();
});

router.use("/auth", authRoute);
router.use("/organizations", organizationRoute);
router.use("/organizations/:organizationId/roles", roleRoute);
router.use("/organizations/:organizationId/permissions", permissionRoute);
router.use("/organizations/:organizationId/roles/:roleId/permissions", rolePermissionRoute);
router.use("/organizations/:organizationId/users/:userId/permissions", userPermissionRoute);

export default router;