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
const login = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield services_1.adminAuthService.login(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.ADMIN, admin, deviceToken, deviceType);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        admin,
    });
}));
const logout = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.token;
    const logoutData = yield services_1.adminAuthService.logout(token);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.LOGOUT);
}));
const changePassword = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.token.admin._id;
    const logoutData = yield services_1.adminAuthService.changePassword(adminId, req.body);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, logoutData);
}));
exports.default = { login, logout, changePassword };
