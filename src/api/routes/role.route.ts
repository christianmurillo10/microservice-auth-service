import { Router } from "express";
import authenticate from "../../middlewares/authenticate.middleware";
import checkPermission from "../../middlewares/check-permission.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/role.validation";
import * as RoleController from "../controllers/role";

const router = Router({ mergeParams: true });

router.get("/", authenticate, checkPermission("list", "role"), listValidation, RoleController.list);
router.post("/", authenticate, checkPermission("create", "role"), createValidation, RoleController.create);
router.get("/:id", authenticate, checkPermission("read", "role"), RoleController.read);
router.put("/:id", authenticate, checkPermission("update", "role"), updateValidation, RoleController.update);
router.delete("/:id", authenticate, checkPermission("delete", "role"), RoleController.remove);
router.post("/delete-by-ids", authenticate, checkPermission("delete", "role"), deleteByIdsValidation, RoleController.deleteByIds);

export default router;