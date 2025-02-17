import { Request, Response } from "express";
import { adminProductService } from "../../services";
import { successResponse } from "../../utils/response";
import {
    SUCCESS_MESSAGES,
    STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const productData = await adminProductService.createProduct(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        productData
    );
});

const getProduct = catchAsync(async (req: Request, res: Response) => {
    const products = await adminProductService.getProduct(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        products
    );
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const updatedProduct = await adminProductService.updateProduct(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        updatedProduct
    );
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const deleteProduct = await adminProductService.deleteProduct(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        deleteProduct
    );
});

export default { createProduct, getProduct, updateProduct, deleteProduct }