import express, { Router } from "express";
import { validate, validateView } from "../../middlewares/validate";
import validation from "../../validations/user/product.validation";
import userProductController from "../../controllers/user/product.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";
import { Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.get('/', auth(USER_TYPE.USER), validate(validation.getProducts), userProductController.getProducts)

router.post('/addRemoveToCart', auth(USER_TYPE.USER), validate(validation.addRemoveToCart), userProductController.addRemoveToCart)

router.post('/createOrder', auth(USER_TYPE.USER), validate(validation.createOrder), userProductController.createOrder)

router.post('/webhook', userProductController.webhook)

export default router

