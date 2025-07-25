import { Router, Request, Response } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import config from "../../config/server.config";
import login from "../controllers/login.controller";
import logout from "../controllers/logout.controller";
import refreshToken from "../controllers/refreshToken";

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

export default router;