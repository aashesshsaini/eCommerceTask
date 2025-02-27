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
const formatResponse_1 = require("../../utils/formatResponse");
const signup = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userAuthService.signup(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const deviceId = req.body.deviceType;
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.USER, user, deviceToken, deviceType, deviceId);
    console.log(user, "user......");
    const formatUserData = (0, formatResponse_1.formatSignUpUser)(user);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        userData: formatUserData,
    });
}));
const login = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield services_1.userAuthService.login(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const deviceId = req.body.deviceType;
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.USER, userData, deviceToken, deviceType, deviceId);
    const formatUserData = (0, formatResponse_1.formatSignUpUser)(userData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        userData: formatUserData,
    });
}));
const changePassword = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.userAuthService.changePassword(req.body, req === null || req === void 0 ? void 0 : req.token);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS);
}));
const deleteAccount = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.deleteAccount((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user, req.query);
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
    const formatedUpdatedProfileData = (0, formatResponse_1.formatUser)(updatedProfileData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, formatedUpdatedProfileData);
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
        if (typeof token !== "string") {
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
        console.log(token, "token.......");
        if (typeof token !== "string") {
            return res.render("commonMessage", {
                title: "Forgot Password",
                errorMessage: "Invalid token",
                // projectName: config.projectName,
            });
        }
        const tokenData = yield services_1.tokenService.verifyResetPasswordToken(token);
        console.log(tokenData, "tokenData.............");
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
            errorMessage: "Sorry, this link has been expired",
            // projectName: config.projectName,
        });
    }
}));
const userInfo = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userInfo = yield services_1.userAuthService.userInfo((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user, req.query);
    const formatedUserInfo = (0, formatResponse_1.formatUser)(userInfo);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, formatedUserInfo);
}));
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
