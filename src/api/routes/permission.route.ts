import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/permission.validation";
import * as PermissionController from "../controllers/permission";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "permission"), 
  listValidation,
  PermissionController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "permission"), 
  createValidation,
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
  updateValidation,
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
  deleteByIdsValidation,
  PermissionController.deleteByIds
);


export default router;