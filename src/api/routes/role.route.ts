import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/role.validation";
import * as RoleController from "../controllers/role";

const router = Router({ mergeParams: true });

router.get(
  "/", 
  authenticate, 
  authorize("list", "role"), 
  listValidation, 
  RoleController.list
);

router.post(
  "/", 
  authenticate, 
  authorize("create", "role"), 
  createValidation, 
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
  updateValidation, 
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
  deleteByIdsValidation, 
  RoleController.deleteByIds
);

export default router;