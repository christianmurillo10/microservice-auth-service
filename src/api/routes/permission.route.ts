import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/permission.validation";
import * as PermissionController from "../controllers/permission";

const router = Router();

router.get("/", authenticate, listValidation, PermissionController.listController);
router.post("/", authenticate, createValidation, PermissionController.createController);
router.get("/:id", authenticate, PermissionController.readController);
router.put("/:id", authenticate, updateValidation, PermissionController.updateController);
router.delete("/:id", authenticate, PermissionController.deleteController);
router.post("/delete-by-ids", authenticate, deleteByIdsValidation, PermissionController.deleteByIdsController);

export default router;