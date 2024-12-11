import express, { Router } from "express";
import { validate, validateView } from "../../middlewares/validate";
import validation from "../../validations/user/common.validation";
import userCommonController from "../../controllers/user/common.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";
import { Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.post(
  "/contactUs",
  auth(USER_TYPE.USER),
  validate(validation.contactUs),
  userCommonController.contactUs
);

router.post(
  "/report",
  auth(USER_TYPE.USER),
  validate(validation.report),
  userCommonController.report
);
