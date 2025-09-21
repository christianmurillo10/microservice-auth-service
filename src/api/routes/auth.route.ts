import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware";
import { loginSchema, refreshTokenSchema } from "../../validations/auth.schema";
import * as AuthController from "../controllers/auth";

const router = Router({ mergeParams: true });

router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", validateBody(refreshTokenSchema), AuthController.refreshToken);

export default router;