import express, { Router } from "express";
import { validate } from "../../middlewares/validate";
import jamAdminValidation from "../../validations/admin/jamAdmin.validation";
import jamAdminController from "../../controllers/admin/jamAdmin.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";

const router = express.Router();

router.get(
  "/getJams",
  auth(USER_TYPE.ADMIN),
  validate(jamAdminValidation.getJams),
  jamAdminController.getJams
);

router.get(
  "/jamInfo",
  auth(USER_TYPE.ADMIN),
  validate(jamAdminValidation.jamInfo),
  jamAdminController.jamInfo
);

router.get(
  "/reports",
  auth(USER_TYPE.ADMIN),
  validate(jamAdminValidation.getReports),
  jamAdminController.getReports
);

router.put(
  "/reportStatus",
  auth(USER_TYPE.ADMIN),
  validate(jamAdminValidation.reportStatus),
  jamAdminController.reportStatus
);

router.get(
  "/reportsPdf",
  auth(USER_TYPE.ADMIN),
  validate(jamAdminValidation.reportPdf),
  jamAdminController.reportPdf
);

export default router;
