import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  sync as syncValidation,
} from "../../middlewares/validations/role-permission.validation";
import * as RolePermissionController from "../controllers/rolePermission";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "role-permission"),
  listValidation,
  RolePermissionController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "role-permission"),
  createValidation,
  RolePermissionController.create
);

router.get(
  "/:id",
  authenticate,
  authorize("read", "role-permission"),
  RolePermissionController.read
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "role-permission"),
  RolePermissionController.remove
);

router.put(
  "/sync",
  authenticate,
  authorize("sync", "role-permission"),
  syncValidation,
  RolePermissionController.sync
);


export default router;