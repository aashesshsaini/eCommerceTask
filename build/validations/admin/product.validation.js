"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const createProduct = {
    body: joi_1.default.object().keys({
        productName: joi_1.default.string().required(),
        productImages: joi_1.default.array().items(joi_1.default.string().required()),
        stock: joi_1.default.number().required(),
        price: joi_1.default.number().required()
    })
};
const getProduct = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow('')
    })
};
const updateProduct = {
    body: joi_1.default.object().keys({
        productId: appConstant_1.JOI.OBJECTID,
        productName: joi_1.default.string(),
        productImages: joi_1.default.array().items(joi_1.default.string()),
        stock: joi_1.default.number(),
        price: joi_1.default.number()
    })
};
const deleteProduct = {
    query: joi_1.default.object().keys({
        productId: appConstant_1.JOI.OBJECTID
    })
};
exports.default = { createProduct, getProduct, updateProduct, deleteProduct };
