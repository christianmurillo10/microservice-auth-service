import { Router } from "express";
import create from "../../controllers/organization/role/create.controller";
import read from "../../controllers/organization/role/read.controller";
import update from "../../controllers/organization/role/update.controller";
import remove from "../../controllers/organization/role/delete.controller";
import list from "../../controllers/organization/role/list.controller";
import deleteByIds from "../../controllers/organization/role/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;