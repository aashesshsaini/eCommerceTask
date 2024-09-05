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
const services_1 = require("../../services");
const response_1 = require("../../utils/response");
const appConstant_1 = require("../../config/appConstant");
const universalFunctions_1 = require("../../utils/universalFunctions");
const signup = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userAuthService.signup(req.body);
    //  const otp = await sendOtp(req.body.phoneNumber as string, req.body.countryCode as string)
    const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.USER, user, deviceToken, deviceType, otp);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        user,
    });
}));
const verifyOtp = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.userAuthService.verifyOtp(req.body.code, req.token._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.VERIFIED);
}));
const resendOtp = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.resendOtp((_a = req.token) === null || _a === void 0 ? void 0 : _a.user);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS);
}));
const createProfile = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield services_1.userAuthService.createProfile(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, userData);
}));
const login = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield services_1.userAuthService.login(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.USER, userData, deviceToken, deviceType);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        userData,
    });
}));
const changePassword = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield services_1.userAuthService.changePassword(req.body, req === null || req === void 0 ? void 0 : req.token);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS);
}));
const deleteAccount = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.deleteAccount((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.DELETE);
}));
const logout = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.logout((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.LOGOUT);
}));
const editProfile = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updatedProfileData = yield services_1.userAuthService.editProfile((_b = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id, req === null || req === void 0 ? void 0 : req.body);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, updatedProfileData);
}));
const editQuestionnaire = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updateQuestionnairedData = yield services_1.userAuthService.editQuestionnaire((_b = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id, req === null || req === void 0 ? void 0 : req.body);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, updateQuestionnairedData);
}));
const forgotPassword = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProfileData = yield services_1.userAuthService.forgotPassword(req === null || req === void 0 ? void 0 : req.body);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, updatedProfileData);
}));
const forgotPage = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.token, "req.query.token");
        const token = req.query.token;
        if (typeof token !== 'string') {
            return res.render("commonMessage", {
                title: "Forgot Password",
                errorMessage: "Invalid token",
                // projectName: config.projectName,
            });
        }
        const tokenData = yield services_1.tokenService.verifyResetPasswordToken(token);
        if (tokenData) {
            return res.render("./forgotPassword/forgotPassword", {
                title: "Forgot Password",
                token: req.query.token,
                // projectName: config.projectName,
            });
        }
        return res.render("commonMessage", {
            title: "Forgot Password",
            errorMessage: "Sorry, this link has been expired",
            // projectName: config.projectName,
        });
    }
    catch (error) {
        res.render("commonMessage", {
            title: "Forgot Password",
            errorMessage: "Sorry, this link has been expired",
            // projectName: config.projectName,
        });
    }
}));
const resetForgotPassword = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.token;
        if (typeof token !== 'string') {
            return res.render("commonMessage", {
                title: "Forgot Password",
                errorMessage: "Invalid token",
                // projectName: config.projectName,
            });
        }
        const tokenData = yield services_1.tokenService.verifyResetPasswordToken(token);
        // console.log(tokenData, "tokenData.............");
        if (!tokenData)
            return res.render("commonMessage", {
                title: "Forgot Password",
                errorMessage: "Sorry, this link has been expiredsss",
                // projectName: config.projectName,
            });
        console.log(tokenData, "tokenData,,,,,,,,,,,,,,,,,,,,,");
        const data = yield services_1.userAuthService.resetPassword(tokenData === null || tokenData === void 0 ? void 0 : tokenData.user, (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.newPassword);
        console.log(data, "userData..........");
        return res.render("commonMessage", {
            title: "Forgot Password",
            successMessage: "Your password is successfully changed",
            // projectName: config.projectName,
        });
    }
    catch (error) {
        res.render("commonMessage", {
            title: "Forgot Password",
            errorMessage: "Sorry, this link has been expiredxxx",
            // projectName: config.projectName,
        });
    }
}));
exports.default = { signup, verifyOtp, resendOtp, createProfile, login, changePassword, deleteAccount, logout, editProfile, editQuestionnaire, forgotPassword, forgotPage, resetForgotPassword };
