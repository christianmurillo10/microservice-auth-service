import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import authRoute from "./auth.route";
import organizationRoute from "./organization.route";
import roleRoute from "./role.route";
import permissionRoute from "./permission.route";
import rolePermissionRoute from "./role-permission.route";
import userPermissionRoute from "./user-permission.route";
import userRoleRoute from "./user-role.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    statusCode: 200,
    message: `Welcome to ${config.appName}`
  }).end();
});

router.use("/auth", authRoute);
router.use("/organizations", organizationRoute);
router.use("/roles", roleRoute);
router.use("/permissions", permissionRoute);
router.use("/roles/:roleId/permissions", rolePermissionRoute);
router.use("/users/:userId/permissions", userPermissionRoute);
router.use("/users/:userId/roles", userRoleRoute);

export default router;