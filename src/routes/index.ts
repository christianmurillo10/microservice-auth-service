import { Router, Request, Response } from "express";
import { apiResponse } from "../shared/utils/api-response";
import config from "../config/server.config";
import authenticationsRoute from "./authentications.route";
import accessTypesRoute from "./access-types.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  apiResponse(res, {
    status_code: 200,
    message: `Welcome to ${config.app_name}`
  }).end();
});

router.use("/authentications", authenticationsRoute);
router.use("/access-types", accessTypesRoute);

export default router;