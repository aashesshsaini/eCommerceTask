import { Request, Response } from "express";
import { userProductService } from "../../services";
import { successResponse } from "../../utils/response";
import {
    SUCCESS_MESSAGES,
    STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";

const getProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await userProductService.getProducts(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        products
    );
});

const addRemoveToCart = catchAsync(async (req: Request, res: Response) => {
    const orderData = await userProductService.addRemoveToCart(req.body, req.token?.user?._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        orderData
    );
});

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const orderData = await userProductService.createOrder(req.body, req.token?.user?._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        orderData
    );
});

const webhook = catchAsync(async (req: Request, res: Response) => {
    const orderData = await userProductService.webhook(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        orderData
    );
});


export default { getProducts, createOrder, addRemoveToCart, webhook }
