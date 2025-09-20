import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { createSchema, deleteByIdsSchema, listSchema, updateSchema } from "../../validations/role.validation";
import * as RoleController from "../controllers/role";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "role"),
  validateQuery(listSchema),
  RoleController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "role"),
  validateBody(createSchema),
  RoleController.create
);

router.get(
  "/:id",
  authenticate,
  authorize("read", "role"),
  RoleController.read
);

router.put(
  "/:id",
  authenticate,
  authorize("update", "role"),
  validateBody(updateSchema),
  RoleController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "role"),
  RoleController.remove
);

router.post(
  "/delete-by-ids",
  authenticate,
  authorize("delete", "role"),
  validateBody(deleteByIdsSchema),
  RoleController.deleteByIds
);

export default router;