import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { createSchema, listSchema, syncSchema } from "../../validations/user-permission.validation";
import * as UserPermissionController from "../controllers/userPermission";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "user-permission"),
  validateQuery(listSchema),
  UserPermissionController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "user-permission"),
  validateBody(createSchema),
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
  validateBody(syncSchema),
  UserPermissionController.sync
);


export default router;