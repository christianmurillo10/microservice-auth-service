import { Router } from "express";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/organization.validation";
import * as OrganizationController from "../controllers/organization";

const upload = multer();
const router = Router();

router.get("/", authenticate, listValidation, OrganizationController.list);
router.post("/", authenticate, upload.single("logo"), createValidation, OrganizationController.create);
router.get("/:id", authenticate, OrganizationController.read);
router.put("/:id", authenticate, upload.single("logo"), updateValidation, OrganizationController.update);
router.delete("/:id", authenticate, OrganizationController.remove);
router.post("/delete-by-ids", authenticate, deleteByIdsValidation, OrganizationController.deleteByIds);

export default router;