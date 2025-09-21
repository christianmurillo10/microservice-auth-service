import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { createSchema, listSchema, syncSchema } from "../../validations/user-role.schema";
import * as UserRoleController from "../controllers/userRole";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "user-role"),
  validateQuery(listSchema),
  UserRoleController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "user-role"),
  validateBody(createSchema),
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
  validateBody(syncSchema),
  UserRoleController.sync
);


export default router;