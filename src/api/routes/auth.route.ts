import { Router } from "express";
import * as AuthController from "../controllers/auth";
import {
  login as loginValidation,
  refreshToken as refreshTokenValidation
} from "../../middlewares/validations/auth.validation";

const router = Router();
router.post("/login", loginValidation, AuthController.loginController);
router.post("/logout", AuthController.logoutController);
router.post("/refresh-token", refreshTokenValidation, AuthController.refreshTokenController);

export default router;