import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/permission.validation";
import * as PermissionController from "../controllers/permission";

const router = Router({ mergeParams: true });

router.get("/", authenticate, listValidation, PermissionController.list);
router.post("/", authenticate, createValidation, PermissionController.create);
router.get("/:id", authenticate, PermissionController.read);
router.put("/:id", authenticate, updateValidation, PermissionController.update);
router.delete("/:id", authenticate, PermissionController.remove);
router.post("/delete-by-ids", authenticate, deleteByIdsValidation, PermissionController.deleteByIds);

export default router;