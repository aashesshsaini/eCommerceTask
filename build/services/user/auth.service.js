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
exports.userInfo = exports.resetPassword = exports.forgotPassword = exports.editProfile = exports.logout = exports.deleteAccount = exports.changePassword = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config/config"));
const sendMails_1 = require("../../libs/sendMails");
const stripeInstance = new stripe_1.default(config_1.default.stripeSecretKey);
const signup = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, mobileNumber, countryCode } = body;
    try {
        const [existinguserByEmail, existinguserByMobileNumber] = yield Promise.all([
            models_1.User.findOne({ email: email, isDeleted: false }),
            models_1.User.findOne({
                mobileNumber: mobileNumber,
                isDeleted: false,
            }),
        ]);
        if (existinguserByEmail) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.EMAIL_ALREADY_EXIST);
        }
        if (existinguserByMobileNumber) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.MOBILE_ALREADY_EXIST);
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield models_1.User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            mobileNumber,
            countryCode,
        });
        // const stripeCustomer = await stripeInstance.customers.create({
        //   name: firstName,
        //   email,
        //   phone: `${countryCode}${mobileNumber}`,
        // });
        // user.stripeCustomerId = stripeCustomer.id;
        // await user.save();
        return user;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.signup = signup;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, mobileNumber } = body;
    console.log(body, "body............");
    try {
        if (email) {
            var user = yield models_1.User.findOne({ email: email, isDeleted: false });
        }
        else {
            var user = yield models_1.User.findOne({ mobileNumber, isDeleted: false });
        }
        console.log(user);
        if (!user) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (user.isBlocked) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.ACCOUNT_BLOCKED);
        }
        console.log(user, "user.........");
        if (user.isDeleted) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.ACCOUNT_DELETED);
        }
        const matchPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!matchPassword) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        const userData = yield models_1.User.findOne({ email });
        return userData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.login = login;
const changePassword = (body, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = body;
    try {
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
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.changePassword = changePassword;
const deleteAccount = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = query;
    try {
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        const [deletedUser, deletedToken] = yield Promise.all([
            models_1.User.findByIdAndUpdate(user._id, { isDeleted: true, isVerified: false }, { lean: true, new: true }),
            models_1.Token.updateMany({ user: user._id }, { isDeleted: false }, { lean: true, new: true }),
        ]);
        if (!deletedUser) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.deleteAccount = deleteAccount;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Token.updateMany({ user: userId }, { isDeleted: false });
});
exports.logout = logout;
const editProfile = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, mobileNumber, countryCode, } = body;
    try {
        const updatedProfileData = yield models_1.User.findByIdAndUpdate(user, {
            firstName,
            lastName,
            email,
            mobileNumber,
            countryCode,
        }, { lean: true, new: true });
        if (!updatedProfileData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return updatedProfileData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.editProfile = editProfile;
const forgotPassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = body;
    try {
        const userData = yield models_1.User.findOne({ email: email });
        const token = yield models_1.Token.findOne({ user: userData === null || userData === void 0 ? void 0 : userData._id });
        console.log(userData, "userData...........");
        if (!userData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        yield (0, sendMails_1.forgotPasswordEmail)(email, token.token, userData.firstName);
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        console.log(hashedPassword);
        const userData = yield models_1.User.findOneAndUpdate({ _id: userId }, { $set: { password: hashedPassword } }, { lean: true, new: true });
        return userData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.resetPassword = resetPassword;
const userInfo = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    return user;
});
exports.userInfo = userInfo;
