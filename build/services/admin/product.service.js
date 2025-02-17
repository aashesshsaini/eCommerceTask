"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const createProduct = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(body, "body.........");
        const productData = yield models_1.Product.create(body);
        console.log(productData);
        return productData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.createProduct = createProduct;
const getProduct = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    try {
        var filter = {
            isDeleted: false,
        };
        if (search) {
            filter = Object.assign(Object.assign({}, filter), { $or: [
                    { productName: { $regex: RegExp(search, "i") } },
                ] });
        }
        const [productListing, productCount] = yield Promise.all([
            models_1.Product.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Product.countDocuments(filter),
        ]);
        return { productListing, productCount };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getProduct = getProduct;
const updateProduct = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, productName, productImages, stock, price } = body;
        const updatedProductData = yield models_1.Product.findOneAndUpdate({ _id: productId, isDeleted: false }, { productName, productImages, stock, price }, { lean: true, new: true });
        if (!updatedProductData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        return updatedProductData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = query;
    try {
        const deletedProduct = yield models_1.Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true, lean: true });
        if (!deletedProduct) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        }
        return { deletedProductData: "Product Delete Successfully" };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.deleteProduct = deleteProduct;
