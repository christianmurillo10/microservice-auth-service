import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  sync as syncValidation,
} from "../../middlewares/validations/user-role.validation";
import * as UserRoleController from "../controllers/userRole";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "user-role"),
  listValidation,
  UserRoleController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "user-role"),
  createValidation,
  UserRoleController.create
);

router.get(
  "/:id",
  authenticate,
  authorize("read", "user-role"),
  UserRoleController.read
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "user-role"),
  UserRoleController.remove
);

router.put(
  "/sync",
  authenticate,
  authorize("sync", "user-role"),
  syncValidation,
  UserRoleController.sync
);


export default router;