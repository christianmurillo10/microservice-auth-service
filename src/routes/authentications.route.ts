import { Router } from "express";
import login from "../controllers/authentications/login.controller";

const router = Router();
router.use(login);

export default router;