import { Router } from "express";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import {
  list as listValidation,
  create as createValidation,
  update as updateValidation,
  deleteByIds as deleteByIdsValidation
} from "../../middlewares/validations/organization.validation";
import * as OrganizationController from "../controllers/organization";

const upload = multer();
const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "organization"),
  listValidation,
  OrganizationController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "organization"),
  upload.single("logo"),
  createValidation,
  OrganizationController.create
);

router.get(
  "/:id",
  authenticate,
  authorize("read", "organization"),
  OrganizationController.read
);

router.put(
  "/:id",
  authenticate,
  authorize("update", "organization"),
  upload.single("logo"),
  updateValidation,
  OrganizationController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("delete", "organization"),
  OrganizationController.remove
);

router.post(
  "/delete-by-ids",
  authenticate,
  authorize("delete", "organization"),
  deleteByIdsValidation,
  OrganizationController.deleteByIds
);


export default router;