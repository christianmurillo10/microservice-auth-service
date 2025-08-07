import { Router } from "express";
import {
  login as loginValidation,
  refreshToken as refreshTokenValidation
} from "../../middlewares/validations/auth.validation";
import * as AuthController from "../controllers/auth";

const router = Router();

router.post("/login", loginValidation, AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", refreshTokenValidation, AuthController.refreshToken);

export default router;