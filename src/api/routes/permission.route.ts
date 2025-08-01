import { Router } from "express";
import create from "../controllers/permission/create.controller";
import read from "../controllers/permission/read.controller";
import update from "../controllers/permission/update.controller";
import remove from "../controllers/permission/delete.controller";
import list from "../controllers/permission/list.controller";
import deleteByIds from "../controllers/permission/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;