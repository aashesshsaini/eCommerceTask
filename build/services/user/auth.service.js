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
exports.location = exports.userInfo = exports.resetPassword = exports.forgotPassword = exports.editQuestionnaire = exports.editProfile = exports.logout = exports.deleteAccount = exports.changePassword = exports.login = exports.createProfile = exports.resendOtp = exports.verifyOtp = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const sendMails_1 = require("../../libs/sendMails");
const universalFunctions_1 = require("../../utils/universalFunctions");
const signup = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, mobileNumber, countryCode } = body;
    const [existinguserByEmail, existinguserByMobileNumber] = yield Promise.all([
        models_1.User.findOne({ email: email, isDeleted: false, isVerified: true }),
        models_1.User.findOne({
            mobileNumber: mobileNumber,
            isDeleted: false,
            isVerified: true,
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
        email,
        password: hashedPassword,
        firstName,
        lastName,
        mobileNumber,
        countryCode,
    });
    yield user.save();
    return user;
});
exports.signup = signup;
const verifyOtp = (code, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokenData = (yield models_1.Token.findOne({
        _id: tokenId,
        isDeleted: false,
    }));
    console.log(code);
    if (((_a = tokenData === null || tokenData === void 0 ? void 0 : tokenData.otp) === null || _a === void 0 ? void 0 : _a.code) !== code) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "OTP is Incorrect");
    }
    const userData = yield models_1.User.findByIdAndUpdate(tokenData.user, { isVerified: true }, { lean: true, new: true });
});
exports.verifyOtp = verifyOtp;
const resendOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId, "userId........");
    const userData = yield models_1.User.findById(userId).lean();
    const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };
    const updateOtpInToken = yield models_1.Token.findOneAndUpdate({ user: userId, isDeleted: false }, { $set: { otp: otp } });
});
exports.resendOtp = resendOtp;
const createProfile = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { zipCode, profileImage, genre, instrument, repertoire, document, bio, proficient, improvisationalSkill, motivation, aboutRepertoire, publicExpirence, caption, } = body;
    console.log(body, "body..........");
    const findIndexFromLevelData = (key, value) => {
        const userValue = value.toLowerCase().trim();
        const array = appConstant_1.LEVEL_DATA[key] || [];
        const index = array.findIndex((item) => item.toLowerCase().trim() === userValue);
        return index === -1 ? -1 : index + 1;
    };
    const proficientIndex = findIndexFromLevelData("proficient", proficient);
    const improvisationalSkillIndex = findIndexFromLevelData("improvisationalSkill", improvisationalSkill);
    const aboutRepertoireIndex = findIndexFromLevelData("aboutRepertoire", aboutRepertoire);
    let level;
    console.log({
        proficientIndex,
        improvisationalSkillIndex,
        aboutRepertoireIndex,
    });
    if (proficientIndex === 1 ||
        (proficientIndex === 2 && improvisationalSkillIndex === 1)) {
        level = "Novice";
    }
    else if ((proficientIndex === 2 && improvisationalSkillIndex >= 2) ||
        (proficientIndex === 3 && improvisationalSkillIndex <= 2) ||
        (proficientIndex === 3 &&
            improvisationalSkillIndex >= 3 &&
            aboutRepertoireIndex === 1) ||
        (proficientIndex === 4 &&
            improvisationalSkillIndex <= 3 &&
            aboutRepertoireIndex === 1)) {
        level = "Beginner";
    }
    else if ((proficientIndex === 3 &&
        improvisationalSkillIndex >= 3 &&
        aboutRepertoireIndex >= 2) ||
        (proficientIndex === 4 &&
            improvisationalSkillIndex <= 3 &&
            aboutRepertoireIndex >= 2) ||
        (proficientIndex === 4 &&
            improvisationalSkillIndex >= 4 &&
            aboutRepertoireIndex === 1)) {
        level = "Intermediate";
    }
    else if ((proficientIndex === 4 &&
        improvisationalSkillIndex >= 4 &&
        aboutRepertoireIndex >= 2) ||
        (proficientIndex === 5 && improvisationalSkillIndex <= 4) ||
        (proficientIndex === 5 &&
            improvisationalSkillIndex === 5 &&
            aboutRepertoireIndex <= 2)) {
        level = "Advance";
    }
    else if (proficientIndex === 5 &&
        improvisationalSkillIndex === 5 &&
        aboutRepertoireIndex >= 3) {
        level = "Pro";
    }
    const updatedUser = yield models_1.User.findByIdAndUpdate(userId, {
        zipCode,
        profileImage,
        genre,
        instrument,
        repertoire,
        document,
        bio,
        proficient,
        improvisationalSkill,
        motivation,
        aboutRepertoire,
        publicExpirence,
        caption,
        level,
        isRegistered: true,
    }, { lean: true, new: true });
    if (!updatedUser) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return updatedUser;
});
exports.createProfile = createProfile;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, mobileNumber, page, limit } = body;
    console.log(body, "body............");
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
    var hostedJamsFilter = {
        user: user._id,
        isDeleted: false,
    };
    var attendedJamsFilter = {
        members: { $in: [user._id] },
        isDeleted: false,
    };
    const [hostedJams, hostedJamsCount, attendedJams, attendedJamsCount] = yield Promise.all([
        models_1.Jam.find(hostedJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(hostedJamsFilter),
        models_1.Jam.find(attendedJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(attendedJamsFilter),
    ]);
    return { user, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount };
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
const deleteAccount = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = query;
    const user = (yield models_1.User.findById(userId));
    const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
    }
    const [deletedUser, deletedToken] = yield Promise.all([
        models_1.User.findByIdAndUpdate(userId, { isDeleted: true, isVerified: false }, { lean: true, new: true }),
        models_1.Token.updateMany({ user: userId }, { isDeleted: false }, { lean: true, new: true }),
    ]);
    if (!deletedUser) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
});
exports.deleteAccount = deleteAccount;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Token.updateMany({ user: userId }, { isDeleted: false });
});
exports.logout = logout;
const editProfile = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, mobileNumber, countryCode, zipCode, profileImage, genre, instrument, repertoire, document, bio, caption, } = body;
    const updatedProfileData = yield models_1.User.findByIdAndUpdate(user, {
        email,
        firstName,
        lastName,
        mobileNumber,
        countryCode,
        zipCode,
        profileImage,
        genre,
        instrument,
        repertoire,
        document,
        bio,
        caption,
    }, { lean: true, new: true });
    if (!updatedProfileData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return updatedProfileData;
});
exports.editProfile = editProfile;
const editQuestionnaire = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { proficient, improvisationalSkill, motivation, aboutRepertoire, publicExpirence, } = body;
    const findIndexFromLevelData = (key, value) => {
        const userValue = value.toLowerCase().trim();
        const array = appConstant_1.LEVEL_DATA[key] || [];
        const index = array.findIndex((item) => item.toLowerCase().trim() === userValue);
        return index === -1 ? -1 : index + 1;
    };
    const proficientIndex = findIndexFromLevelData("proficient", proficient);
    const improvisationalSkillIndex = findIndexFromLevelData("improvisationalSkill", improvisationalSkill);
    const aboutRepertoireIndex = findIndexFromLevelData("aboutRepertoire", aboutRepertoire);
    let level;
    console.log({
        proficientIndex,
        improvisationalSkillIndex,
        aboutRepertoireIndex,
    });
    if (proficientIndex === 1 ||
        (proficientIndex === 2 && improvisationalSkillIndex === 1)) {
        level = "Novice";
    }
    else if ((proficientIndex === 2 && improvisationalSkillIndex >= 2) ||
        (proficientIndex === 3 && improvisationalSkillIndex <= 2) ||
        (proficientIndex === 3 &&
            improvisationalSkillIndex >= 3 &&
            aboutRepertoireIndex === 1) ||
        (proficientIndex === 4 &&
            improvisationalSkillIndex <= 3 &&
            aboutRepertoireIndex === 1)) {
        level = "Beginner";
    }
    else if ((proficientIndex === 3 &&
        improvisationalSkillIndex >= 3 &&
        aboutRepertoireIndex >= 2) ||
        (proficientIndex === 4 &&
            improvisationalSkillIndex <= 3 &&
            aboutRepertoireIndex >= 2) ||
        (proficientIndex === 4 &&
            improvisationalSkillIndex >= 4 &&
            aboutRepertoireIndex === 1)) {
        level = "Intermediate";
    }
    else if ((proficientIndex === 4 &&
        improvisationalSkillIndex >= 4 &&
        aboutRepertoireIndex >= 2) ||
        (proficientIndex === 5 && improvisationalSkillIndex <= 4) ||
        (proficientIndex === 5 &&
            improvisationalSkillIndex === 5 &&
            aboutRepertoireIndex <= 2)) {
        level = "Advance";
    }
    else if (proficientIndex === 5 &&
        improvisationalSkillIndex === 5 &&
        aboutRepertoireIndex >= 3) {
        level = "Pro";
    }
    const updateQuestionnairedData = yield models_1.User.findByIdAndUpdate(user, {
        proficient,
        improvisationalSkill,
        motivation,
        aboutRepertoire,
        publicExpirence,
        level,
    }, { lean: true, new: true });
    if (!updateQuestionnairedData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return updateQuestionnairedData;
});
exports.editQuestionnaire = editQuestionnaire;
const forgotPassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = body;
    const userData = yield models_1.User.findOne({ email: email });
    const token = yield models_1.Token.findOne({ user: userData === null || userData === void 0 ? void 0 : userData._id });
    console.log(userData, "userData...........");
    if (!userData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    yield (0, sendMails_1.forgotPasswordEmail)(email, token === null || token === void 0 ? void 0 : token.token);
});
exports.forgotPassword = forgotPassword;
const resetPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(newPassword, 'newPasword.............')
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    console.log(hashedPassword);
    const userData = yield models_1.User.findOneAndUpdate({ _id: userId }, { $set: { password: hashedPassword } }, { lean: true, new: true });
    return userData;
});
exports.resetPassword = resetPassword;
const userInfo = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    var hostedJamsFilter = {
        user: userId,
        isDeleted: false,
    };
    var attendedJamsFilter = {
        members: { $in: [userId] },
        isDeleted: false,
    };
    const [userInfo, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount,] = yield Promise.all([
        models_1.User.findById(userId).lean(),
        models_1.Jam.find(hostedJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)).populate("user"),
        models_1.Jam.countDocuments(hostedJamsFilter),
        models_1.Jam.find(attendedJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)).populate("user"),
        models_1.Jam.countDocuments(attendedJamsFilter),
    ]);
    if (!userInfo) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const favMembers = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.favMembers) || [];
    const addIsFav = (jamList) => {
        return jamList.map((jam) => (Object.assign(Object.assign({}, jam), { user: Object.assign(Object.assign({}, jam.user), { isFav: favMembers.includes(jam.user._id) ? true : false }) })));
    };
    const jamsWithFav = addIsFav(hostedJams);
    const nearByJamsWithFav = addIsFav(attendedJams);
    return {
        userInfo,
        hostedJams: jamsWithFav,
        hostedJamsCount,
        attendedJams: nearByJamsWithFav,
        attendedJamsCount,
    };
});
exports.userInfo = userInfo;
const location = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude } = body;
    const userData = yield models_1.User.findByIdAndUpdate(userId, {
        loc: { type: "Point", coordinates: [longitude, latitude] },
    }, { new: true });
    if (!userData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return userData;
});
exports.location = location;
