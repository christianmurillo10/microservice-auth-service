import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
} from "../../middlewares/validations/role-permission.validation";
import * as RolePermissionController from "../controllers/rolePermission";

const router = Router();

router.get("/", authenticate, listValidation, RolePermissionController.list);
router.post("/", authenticate, createValidation, RolePermissionController.create);
router.get("/:id", authenticate, RolePermissionController.read);
router.delete("/:id", authenticate, RolePermissionController.remove);

export default router;