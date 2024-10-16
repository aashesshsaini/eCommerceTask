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
const jamCreate = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jamData = yield services_1.userJamService.jamCreate(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, jamData);
}));
const jamGet = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const timeZone = (_a = req.headers.timezone) !== null && _a !== void 0 ? _a : "Asia/Kolkata";
    const { jams, jamsCount, nearByJams, nearByJamsCount, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount } = yield services_1.userJamService.jamGet(req.query, req.token.user._id, timeZone);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, { jams, jamsCount, nearByJams, nearByJamsCount, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount });
}));
const jamUpdate = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jamUpdatedData = yield services_1.userJamService.jamUpdate(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, jamUpdatedData);
}));
const jamDelete = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.userJamService.jamDelete(req.query, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, "Jam delete successfully");
}));
const jamInfo = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jamdData = yield services_1.userJamService.jamInfo(req.query, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, jamdData);
}));
const cancelJam = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jamUpdatedData = yield services_1.userJamService.cancelJam(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, jamUpdatedData);
}));
const getUsers = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Users, countUser } = yield services_1.userJamService.getUsers(req.query, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, { Users, countUser });
}));
const favMember = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield services_1.userJamService.favMember(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, message);
}));
const favMemberGet = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { favMemList, favMemCount } = yield services_1.userJamService.favMemberGet(req.query, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, { favMemList, favMemCount });
}));
const inviteMembers = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield services_1.userJamService.inviteMembers(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, members);
}));
const acceptJam = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield services_1.userJamService.acceptJam(req.body, req.token.user._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, members);
}));
exports.default = { jamCreate, jamGet, jamUpdate, jamDelete, jamInfo, cancelJam, getUsers, favMember, favMemberGet, inviteMembers, acceptJam };
