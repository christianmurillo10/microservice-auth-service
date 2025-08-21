import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  sync as syncValidation,
} from "../../middlewares/validations/user-permission.validation";
import * as UserPermissionController from "../controllers/userPermission";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "user-permission"),
  listValidation,
  UserPermissionController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "user-permission"),
  createValidation,
  UserPermissionController.create
);

router.get(
  "/:id",
  authenticate,
  authorize("read", "user-permission"),
  UserPermissionController.read
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "user-permission"),
  UserPermissionController.remove
);

router.put(
  "/sync",
  authenticate,
  authorize("sync", "user-permission"),
  syncValidation,
  UserPermissionController.sync
);


export default router;