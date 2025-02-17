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
exports.verifyResetPasswordToken = exports.verifyEmailToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("../config/config"));
const appConstant_1 = require("../config/appConstant");
const models_1 = require("../models");
const generateToken = (data, secret = config_1.default.jwt.secret) => {
    const payload = {
        exp: data.tokenExpires.unix(),
        type: data.tokenType,
        id: data.tokenId,
        role: data.userType,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
const saveToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const dataToBeSaved = {
        expires: data.tokenExpires.toDate(),
        type: data.tokenType,
        _id: data.tokenId,
        device: { type: data.deviceType, token: data.deviceToken, id: data.deviceId },
        role: data.userType,
        token: data === null || data === void 0 ? void 0 : data.accessToken,
        otp: data.otp
    };
    if (data.userType === appConstant_1.USER_TYPE.ADMIN) {
        dataToBeSaved.admin = (_a = data.user) === null || _a === void 0 ? void 0 : _a._id;
    }
    else {
        data.userType === appConstant_1.USER_TYPE.USER;
        dataToBeSaved.user = (_b = data.user) === null || _b === void 0 ? void 0 : _b._id;
        ;
    }
    const tokenDoc = yield models_1.Token.create(dataToBeSaved);
    console.log(tokenDoc, "tokenDoc.....");
    return tokenDoc;
});
const generateAuthToken = (userType, user, deviceToken, deviceType, deviceId, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'days');
    const tokenId = new mongodb_1.ObjectId();
    const accessToken = generateToken({
        tokenExpires,
        tokenType: appConstant_1.TOKEN_TYPE.ACCESS,
        userType,
        tokenId,
        deviceToken,
        deviceType,
        deviceId
        // user
    });
    yield saveToken({
        accessToken,
        tokenExpires,
        tokenId,
        deviceToken,
        deviceType,
        deviceId,
        tokenType: appConstant_1.TOKEN_TYPE.ACCESS,
        userType,
        user,
        otp
    });
    return {
        token: accessToken,
        expires: tokenExpires.toDate(),
    };
});
exports.generateAuthToken = generateAuthToken;
const verifyEmailToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(token);
    const payload = jsonwebtoken_1.default.verify(token, (_a = config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.jwt) === null || _a === void 0 ? void 0 : _a.secret);
    try {
        if (payload) {
            const tokenData = yield models_1.Token.findOne({ _id: payload === null || payload === void 0 ? void 0 : payload.id, isDeleted: false });
            return tokenData || null;
        }
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.verifyEmailToken = verifyEmailToken;
const verifyResetPasswordToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        console.log(payload, 'payload............');
        const tokenData = yield models_1.Token.findOne({
            _id: payload === null || payload === void 0 ? void 0 : payload.id,
            isDeleted: false,
            // expires: { $gte: new Date() },
        }).populate('user');
        console.log(tokenData, "tokenData");
        return tokenData;
    }
    catch (error) {
        throw error;
    }
});
exports.verifyResetPasswordToken = verifyResetPasswordToken;
