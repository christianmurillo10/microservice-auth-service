import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  sync as syncValidation,
} from "../../middlewares/validations/user-role.validation";
import * as UserRoleController from "../controllers/userRole";

const router = Router({ mergeParams: true });

router.get("/", authenticate, listValidation, UserRoleController.list);
router.post("/", authenticate, createValidation, UserRoleController.create);
router.get("/:id", authenticate, UserRoleController.read);
router.delete("/:id", authenticate, UserRoleController.remove);
router.put("/sync", authenticate, syncValidation, UserRoleController.sync);

export default router;