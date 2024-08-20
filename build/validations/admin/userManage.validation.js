"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const addUser = {
    body: joi_1.default.object().keys({
        email: appConstant_1.JOI.EMAIL,
        password: appConstant_1.JOI.PASSWORD
    })
};
const deleteUser = {
    query: joi_1.default.object().keys({
        userId: appConstant_1.JOI.OBJECTID,
    }),
};
const userBlock = {
    body: joi_1.default.object().keys({
        userId: appConstant_1.JOI.OBJECTID,
    }),
};
const getUsers = {
    query: joi_1.default.object().keys({
        limit: appConstant_1.JOI.LIMIT,
        page: appConstant_1.JOI.PAGE,
        search: joi_1.default.string().allow("", null),
    }),
};
const userInfo = {
    query: joi_1.default.object().keys({
        userId: appConstant_1.JOI.OBJECTID,
    }),
};
const dashboard = {
    query: joi_1.default.object().keys({
    // token: Joi.string().required()
    })
};
exports.default = { addUser, deleteUser, userBlock, getUsers, userInfo, dashboard };
