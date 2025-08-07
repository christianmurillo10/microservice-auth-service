import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
} from "../../middlewares/validations/role-permission.validation";
import * as RolePermissionController from "../controllers/rolePermission";

const router = Router();

router.get("/", authenticate, listValidation, RolePermissionController.listController);
router.post("/", authenticate, createValidation, RolePermissionController.createController);
router.get("/:id", authenticate, RolePermissionController.readController);
router.delete("/:id", authenticate, RolePermissionController.deleteController);

export default router;