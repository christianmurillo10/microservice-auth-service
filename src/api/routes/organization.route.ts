import { Router } from "express";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.middleware";
import authorize from "../../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { createSchema, deleteByIdsSchema, listSchema, updateSchema } from "../../validations/organization.validation";
import * as OrganizationController from "../controllers/organization";

const upload = multer();
const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize("list", "organization"),
  validateQuery(listSchema),
  OrganizationController.list
);

router.post(
  "/",
  authenticate,
  authorize("create", "organization"),
  upload.single("logo"),
  validateBody(createSchema),
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
  validateBody(updateSchema),
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
  validateBody(deleteByIdsSchema),
  OrganizationController.deleteByIds
);


export default router;