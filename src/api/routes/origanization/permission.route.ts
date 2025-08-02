import { Router } from "express";
import create from "../../controllers/organization/permission/create.controller";
import read from "../../controllers/organization/permission/read.controller";
import update from "../../controllers/organization/permission/update.controller";
import remove from "../../controllers/organization/permission/delete.controller";
import list from "../../controllers/organization/permission/list.controller";
import deleteByIds from "../../controllers/organization/permission/delete-by-ids.controller";

const router = Router();
router.use(create);
router.use(read);
router.use(update);
router.use(remove);
router.use(list);
router.use(deleteByIds);

export default router;