import express, { Router } from 'express';
import { validate } from '../../middlewares/validate';
import validation from '../../validations/admin/product.validation';
import controller from '../../controllers/admin/product.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';

const router = express.Router();

router.route('/')
    .post(auth(USER_TYPE.ADMIN), validate(validation.createProduct), controller.createProduct)
    .get(auth(USER_TYPE.ADMIN), validate(validation.getProduct), controller.getProduct)
    .put(auth(USER_TYPE.ADMIN), validate(validation.updateProduct), controller.updateProduct)
    .delete(auth(USER_TYPE.ADMIN), validate(validation.deleteProduct), controller.deleteProduct);

router.get('/orderListing', auth(USER_TYPE.ADMIN), validate(validation.orderListing), controller.orderListing)

export default router;
