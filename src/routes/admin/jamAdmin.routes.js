import express, { Router } from 'express';
import { validate } from '../../middlewares/validate';
import jamAdminValidation from '../../validations/admin/jamAdmin.validation';
import jamAdminController from '../../controllers/admin/jamAdmin.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';

const router = express.Router();

router.get(
  "/getJams",
  auth(USER_TYPE.ADMIN),
  validate(jamAdminValidation.getJams),
  jamAdminController.getjams
);

export default router;
