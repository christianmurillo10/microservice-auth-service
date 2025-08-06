import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import login from "../controllers/login.controller";
import logout from "../controllers/logout.controller";
import refreshToken from "../controllers/refreshToken";
import organizationRoute from "./organization.route";
import roleRoute from "./role.route";
import permissionRoute from "./permission.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    statusCode: 200,
    message: `Welcome to ${config.appName}`
  }).end();
});

router.use(login);
router.use(logout);
router.use(refreshToken);
router.use("/organizations", organizationRoute);
router.use("/organizations/:organizationId/roles", roleRoute);
router.use("/organizations/:organizationId/permissions", permissionRoute);

export default router;