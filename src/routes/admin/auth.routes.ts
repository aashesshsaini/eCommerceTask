import express, { Router } from 'express';
import { validate } from '../../middlewares/validate';
import validation from '../../validations/admin/auth.validation';
import controller from '../../controllers/admin/auth.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/login', validate(validation.login), controller.login);

router.put('/logout', auth(USER_TYPE.ADMIN), controller.logout);

router.put('/changePassword', auth(USER_TYPE.ADMIN), validate(validation.changePassword), controller.changePassword);

export default router;
