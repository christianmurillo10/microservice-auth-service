import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/role.validation";
import * as RoleController from "../controllers/role";

const router = Router();

router.get("/", authenticate, listValidation, RoleController.listController);
router.post("/", authenticate, createValidation, RoleController.createController);
router.get("/:id", authenticate, RoleController.readController);
router.put("/:id", authenticate, updateValidation, RoleController.updateController);
router.delete("/:id", authenticate, RoleController.deleteController);
router.post("/delete-by-ids", authenticate, deleteByIdsValidation, RoleController.deleteByIdsController);

export default router;