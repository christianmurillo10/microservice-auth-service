import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { createSchema, listSchema, syncSchema } from "../../validations/role-permission.validation";
import * as RolePermissionController from "../controllers/rolePermission";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "role-permission"),
  validateQuery(listSchema),
  RolePermissionController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "role-permission"),
  validateBody(createSchema),
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
  validateBody(syncSchema),
  RolePermissionController.sync
);


export default router;