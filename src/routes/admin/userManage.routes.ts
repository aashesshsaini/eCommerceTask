import express, { Router } from 'express';
import { validate } from '../../middlewares/validate';
import validation from '../../validations/admin/userManage.validation';
import controller from '../../controllers/admin/userManage.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';


const router = express.Router();

router.post('/addUser', auth(USER_TYPE.ADMIN), validate(validation.addUser), controller.addUser)

router.delete('/deleteUser', auth(USER_TYPE.ADMIN), validate(validation.deleteUser), controller.deleteUser)

router.get('/userInfo', auth(USER_TYPE.ADMIN), validate(validation.userInfo), controller.userInfo)

router.get('/getUsers', auth(USER_TYPE.ADMIN), validate(validation.getUsers), controller.getUsers)

router.put('/userBlock', auth(USER_TYPE.ADMIN), validate(validation.userBlock), controller.userBlock)

router.get('/dashboard', auth(USER_TYPE.ADMIN), validate(validation.dashboard), controller.dashboard)

export default router;