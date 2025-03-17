import { Router } from "express";
import login from "../controllers/authentications/login.controller";
import logout from "../controllers/authentications/logout.controller";
import verify from "../controllers/authentications/verify.controller";

const router = Router();
router.use(login);
router.use(logout);
router.use(verify);

export default router;