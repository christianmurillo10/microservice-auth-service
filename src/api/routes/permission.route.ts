import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { createSchema, deleteByIdsSchema, listSchema, updateSchema } from "../../validations/permission.schema";
import * as PermissionController from "../controllers/permission";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "permission"),
  validateQuery(listSchema),
  PermissionController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "permission"),
  validateBody(createSchema),
  PermissionController.create
);

router.get(
  "/:id",
  authenticate,
  authorize("read", "permission"),
  PermissionController.read
);

router.put(
  "/:id",
  authenticate,
  authorize("update", "permission"),
  validateBody(updateSchema),
  PermissionController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "permission"),
  PermissionController.remove
);

router.post(
  "/delete-by-ids",
  authenticate,
  authorize("delete", "permission"),
  validateBody(deleteByIdsSchema),
  PermissionController.deleteByIds
);


export default router;