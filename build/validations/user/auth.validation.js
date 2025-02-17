"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const signup = {
    body: joi_1.default.object().keys({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        mobileNumber: appConstant_1.JOI.PHONENUMBER,
        countryCode: joi_1.default.string().required(),
        email: appConstant_1.JOI.EMAIL,
        password: appConstant_1.JOI.PASSWORD,
        profileImage: joi_1.default.string()
    }),
};
const login = {
    body: joi_1.default.object().keys({
        mobileNumber: joi_1.default.string()
            .min(5)
            .max(15)
            .pattern(/^[0-9]+$/),
        email: joi_1.default.string().email().lowercase().trim(),
        password: appConstant_1.JOI.PASSWORD,
    }),
};
const changePassword = {
    body: joi_1.default.object().keys({
        newPassword: appConstant_1.JOI.PASSWORD,
        oldPassword: appConstant_1.JOI.PASSWORD,
    }),
};
const deleteAccount = {
    query: joi_1.default.object().keys({
        password: appConstant_1.JOI.PASSWORD,
    }),
};
const logout = {
    body: joi_1.default.object().keys({}),
};
const editProfile = {
    body: joi_1.default.object().keys({
        firstName: joi_1.default.string(),
        lastName: joi_1.default.string(),
        mobileNumber: joi_1.default.string()
            .min(5)
            .max(15)
            .pattern(/^[0-9]+$/),
        countryCode: joi_1.default.string(),
        profileImage: joi_1.default.string(),
    }),
};
const forgotPassword = {
    body: joi_1.default.object().keys({
        email: appConstant_1.JOI.EMAIL,
    }),
};
const forgotPage = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
const resetForgotPassword = {
    body: joi_1.default.object().keys({
        newPassword: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.any()
            .valid(joi_1.default.ref("newPassword"))
            .required()
            .messages({ "any.only": "Password does not match" }),
    }),
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
const userInfo = {
    query: joi_1.default.object().keys({}),
};
exports.default = {
    signup,
    login,
    changePassword,
    deleteAccount,
    logout,
    editProfile,
    forgotPassword,
    forgotPage,
    resetForgotPassword,
    userInfo,
};
