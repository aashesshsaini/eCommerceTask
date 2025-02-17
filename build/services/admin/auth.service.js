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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = body;
    try {
        const admin = yield models_1.Admin.findOne({ email });
        if (!admin) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.EMAIL_NOT_FOUND);
        }
        const comparePassword = yield bcryptjs_1.default.compare(password, admin.password);
        if (!comparePassword) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        console.log(admin);
        return admin;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.login = login;
const logout = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedToken = yield models_1.Token.findByIdAndUpdate(tokenId, {
            isDeleted: true,
        });
        return updatedToken;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.logout = logout;
const changePassword = (adminId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = body;
    try {
        const adminData = yield models_1.Admin.findById(adminId);
        if (!adminData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        console.log(body);
        const compare = yield bcryptjs_1.default.compare(oldPassword, adminData === null || adminData === void 0 ? void 0 : adminData.password);
        if (!compare) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        const newHashedPassword = yield bcryptjs_1.default.hash(newPassword, 8);
        let updatedPassword = { password: newHashedPassword };
        Object.assign(adminData, updatedPassword);
        yield adminData.save();
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.changePassword = changePassword;
