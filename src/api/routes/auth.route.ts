import { Router } from "express";
import login from "../controllers/login.controller";
import logout from "../controllers/logout.controller";
import refreshToken from "../controllers/refreshToken";

const router = Router();
router.use(login);
router.use(logout);
router.use(refreshToken);

export default router;