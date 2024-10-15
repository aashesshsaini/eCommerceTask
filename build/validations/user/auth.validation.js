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
    })
};
const verifyOtp = {
    body: joi_1.default.object().keys({
        code: joi_1.default.string().required(),
    }),
};
const resendOtp = {
    body: joi_1.default.object().keys({})
};
const createProfile = {
    body: joi_1.default.object().keys({
        zipCode: joi_1.default.string(),
        profileImage: joi_1.default.string(),
        genre: joi_1.default.string(),
        instrument: joi_1.default.string(),
        commitmentLevel: joi_1.default.string().valid(...Object.values(appConstant_1.COMMITMENT_LEVEL)),
        repertoire: joi_1.default.array().items(joi_1.default.string()).max(3),
        bio: joi_1.default.string(),
        document: joi_1.default.string(),
        proficient: joi_1.default.string(),
        improvisationalSkill: joi_1.default.string(),
        motivation: joi_1.default.string(),
        aboutRepertoire: joi_1.default.string(),
        publicExpirence: joi_1.default.string()
    })
};
const login = {
    body: joi_1.default.object().keys({
        mobileNumber: joi_1.default.string()
            .min(5)
            .max(15)
            .pattern(/^[0-9]+$/),
        email: joi_1.default.string().email().lowercase().trim(),
        password: appConstant_1.JOI.PASSWORD,
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT
    })
};
const changePassword = {
    body: joi_1.default.object().keys({
        newPassword: appConstant_1.JOI.PASSWORD,
        oldPassword: appConstant_1.JOI.PASSWORD
    })
};
const deleteAccount = {
    query: joi_1.default.object().keys({
        password: appConstant_1.JOI.PASSWORD
    })
};
const logout = {
    body: joi_1.default.object().keys({})
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
        email: joi_1.default.string().email().lowercase().trim(),
        zipCode: joi_1.default.string(),
        profileImage: joi_1.default.string(),
        genre: joi_1.default.string(),
        instrument: joi_1.default.string(),
        repertoire: joi_1.default.array().items(joi_1.default.string()).max(3),
        commitmentLevel: joi_1.default.string().valid(...Object.values(appConstant_1.COMMITMENT_LEVEL)),
        bio: joi_1.default.string(),
        document: joi_1.default.string(),
    })
};
const editQuestionnaire = {
    body: joi_1.default.object().keys({
        proficient: joi_1.default.string(),
        improvisationalSkill: joi_1.default.string(),
        motivation: joi_1.default.string(),
        aboutRepertoire: joi_1.default.string(),
        publicExpirence: joi_1.default.string()
    })
};
const forgotPassword = {
    body: joi_1.default.object().keys({
        email: appConstant_1.JOI.EMAIL
    })
};
const forgotPage = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required()
    })
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
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT
    })
};
exports.default = { signup, verifyOtp, resendOtp, createProfile, login, changePassword, deleteAccount, logout, editProfile, editQuestionnaire, forgotPassword, forgotPage, resetForgotPassword, userInfo };
