import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/role.validation";
import * as RoleController from "../controllers/role";

const router = Router({ mergeParams: true });

router.get("/", authenticate, listValidation, RoleController.list);
router.post("/", authenticate, createValidation, RoleController.create);
router.get("/:id", authenticate, RoleController.read);
router.put("/:id", authenticate, updateValidation, RoleController.update);
router.delete("/:id", authenticate, RoleController.remove);
router.post("/delete-by-ids", authenticate, deleteByIdsValidation, RoleController.deleteByIds);

export default router;