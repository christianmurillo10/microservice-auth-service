import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  sync as syncValidation,
} from "../../middlewares/validations/role-permission.validation";
import * as RolePermissionController from "../controllers/rolePermission";

const router = Router({ mergeParams: true });

router.get("/", authenticate, listValidation, RolePermissionController.list);
router.post("/", authenticate, createValidation, RolePermissionController.create);
router.get("/:id", authenticate, RolePermissionController.read);
router.delete("/:id", authenticate, RolePermissionController.remove);
router.put("/sync", authenticate, syncValidation, RolePermissionController.sync);

export default router;