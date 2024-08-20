import express, { Router } from 'express';
import { validate, validateView } from '../../middlewares/validate';
import validation from '../../validations/user/auth.validation';
import userAuthController from '../../controllers/user/auth.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';
import { Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

router.post('/signup', validate(validation.signup), userAuthController.signup)

router.post(
    "/verifyOtp",
    auth(USER_TYPE.USER),
    validate(validation.verifyOtp),
    userAuthController.verifyOtp
  );

router.post('/login', validate(validation.login), userAuthController.login)

router.put('/changePassword', auth(USER_TYPE.USER), validate(validation.changePassword), userAuthController.changePassword)

router.put("/logout", auth(USER_TYPE.USER), validate(validation.logout), userAuthController.logout)

router.put("/editProfile", auth(USER_TYPE.USER), validate(validation.editProfile), userAuthController.editProfile)

router.post("/forgotPassword", auth(USER_TYPE.USER), validate(validation.forgotPassword), userAuthController.forgotPassword)

router.route('/resetPassword').get(validateView(validation.forgotPage), userAuthController.forgotPage).post(validateView(validation.resetForgotPassword), userAuthController.resetForgotPassword)

export default router;