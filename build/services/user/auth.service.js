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
exports.resetPassword = exports.forgotPassword = exports.editProfile = exports.logout = exports.changePassword = exports.login = exports.verifyOtp = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const sendMails_1 = require("../../libs/sendMails");
const signup = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullName, mobileNumber, countryCode } = body;
    const existinguser = yield models_1.User.findOne({ email: email });
    if (existinguser) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.EMAIL_ALREADY_EXIST);
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield models_1.User.create({ email, password: hashedPassword, fullName, mobileNumber, countryCode });
    yield user.save();
    return user;
});
exports.signup = signup;
const verifyOtp = (code, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokenData = yield models_1.Token.findOne({ _id: tokenId, isDeleted: false });
    console.log(code);
    if (((_a = tokenData === null || tokenData === void 0 ? void 0 : tokenData.otp) === null || _a === void 0 ? void 0 : _a.code) !== code) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "OTP is Incorrect");
    }
    const userData = yield models_1.User.findByIdAndUpdate(tokenData.user, { isVerified: true }, { lean: true, new: true });
});
exports.verifyOtp = verifyOtp;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = body;
    const user = yield models_1.User.findOne({ email: email });
    if (!user) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    if (user.isBlocked) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.ACCOUNT_BLOCKED);
    }
    if (user.isDeleted) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.ACCOUNT_DELETED);
    }
    const matchPassword = yield bcryptjs_1.default.compare(password, user.password);
    if (!matchPassword) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
    }
    return user;
});
exports.login = login;
const changePassword = (body, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = body;
    const user = yield models_1.User.findById(token === null || token === void 0 ? void 0 : token.user);
    if (!user) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const passwordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
    }
    const userNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    const updatePassword = { password: userNewPassword };
    Object.assign(user, updatePassword);
    yield user.save();
    return user;
});
exports.changePassword = changePassword;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Token.updateMany({ user: userId }, { isDeleted: false });
});
exports.logout = logout;
const editProfile = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, profileImage } = body;
    const updatedProfileData = yield models_1.User.findByIdAndUpdate(user, { fullName, profileImage }, { lean: true, new: true });
    if (!updatedProfileData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return updatedProfileData;
});
exports.editProfile = editProfile;
const forgotPassword = (token, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = body;
    const userData = yield models_1.User.findById(token === null || token === void 0 ? void 0 : token.user);
    console.log(userData, "userData...........");
    if ((userData === null || userData === void 0 ? void 0 : userData.email) !== email) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "please fill personal email");
    }
    yield (0, sendMails_1.forgotPasswordEmail)(email, token === null || token === void 0 ? void 0 : token.token);
});
exports.forgotPassword = forgotPassword;
const resetPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(newPassword, 'newPasword.............');
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    console.log(hashedPassword);
    const userData = yield models_1.User.findOneAndUpdate({ _id: userId }, { $set: { password: hashedPassword } }, { lean: true, new: true });
    return userData;
});
exports.resetPassword = resetPassword;
