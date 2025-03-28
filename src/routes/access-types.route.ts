import { Router } from "express";
import create from "../controllers/accessTypes/create.controller";
import read from "../controllers/accessTypes/read.controller";
import update from "../controllers/accessTypes/update.controller";
import remove from "../controllers/accessTypes/delete.controller";
import list from "../controllers/accessTypes/list.controller";
import deleteByIds from "../controllers/accessTypes/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;