"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const getProducts = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow('')
    })
};
const addRemoveToCart = {
    body: joi_1.default.object().keys({
        productId: appConstant_1.JOI.OBJECTID,
        actionCase: joi_1.default.string().required().valid(...Object.values(appConstant_1.CART_ACTION_CASE))
    })
};
const createOrder = {
    body: joi_1.default.object().keys({
        productId: appConstant_1.JOI.OBJECTID,
        quantity: joi_1.default.number().required()
    })
};
exports.default = { getProducts, createOrder, addRemoveToCart };
