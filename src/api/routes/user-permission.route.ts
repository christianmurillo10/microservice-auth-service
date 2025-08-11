import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  sync as syncValidation,
} from "../../middlewares/validations/user-permission.validation";
import * as UserPermissionController from "../controllers/userPermission";

const router = Router({ mergeParams: true });

router.get("/", authenticate, listValidation, UserPermissionController.list);
router.post("/", authenticate, createValidation, UserPermissionController.create);
router.get("/:id", authenticate, UserPermissionController.read);
router.delete("/:id", authenticate, UserPermissionController.remove);
router.put("/sync", authenticate, syncValidation, UserPermissionController.sync);

export default router;