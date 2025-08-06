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

router.get("/", authenticate, listValidation, OrganizationController.listController);
router.post("/", authenticate, upload.single("logo"), createValidation, OrganizationController.createController);
router.get("/:id", authenticate, OrganizationController.readController);
router.put("/:id", authenticate, upload.single("logo"), updateValidation, OrganizationController.updateController);
router.delete("/:id", authenticate, OrganizationController.deleteController);
router.post("/delete-by-ids", authenticate, deleteByIdsValidation, OrganizationController.deleteByIdsController);

export default router;