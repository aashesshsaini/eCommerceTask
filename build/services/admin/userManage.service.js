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
exports.dashboard = exports.getUsers = exports.userInfo = exports.userBlock = exports.deleteUser = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const deleteUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = query;
    try {
        const [deletedProfile, deletedToken] = yield Promise.all([
            models_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { lean: true, new: true }),
            models_1.Token.updateMany({ user: userId }, { isDeleted: true }),
        ]);
        if (!deletedProfile) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.deleteUser = deleteUser;
const userBlock = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = body;
    try {
        const user = yield models_1.User.findOne({
            _id: userId,
            isDeleted: false,
            isBlocked: false,
        });
        if (user) {
            var updateUser = yield models_1.User.findByIdAndUpdate({ _id: userId, isBlocked: false }, { isBlocked: true }, { lean: true, new: true });
            return { updateUser: "user Inactive successfully" };
        }
        else {
            updateUser = yield models_1.User.findByIdAndUpdate({ _id: userId, isBlocked: true }, { isBlocked: false }, { lean: true, new: true });
            return { updateUser: "user Active successfully" };
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.userBlock = userBlock;
const userInfo = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = query;
    console.log(userId, "userId..............");
    try {
        const user = yield models_1.User.findOne({
            _id: userId,
            isDeleted: false,
        }, { password: 0 });
        console.log(user);
        if (!user) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.userInfo = userInfo;
const getUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    try {
        var filter = {
            isDeleted: false,
        };
        if (search) {
            filter = Object.assign(Object.assign({}, filter), { $or: [
                    { firstName: { $regex: RegExp(search, "i") } },
                    { lastName: { $regex: RegExp(search, "i") } },
                    { email: { $regex: RegExp(search, "i") } },
                ] });
        }
        const [Users, countUser] = yield Promise.all([
            models_1.User.find(filter, { password: 0 }, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.User.countDocuments(filter),
        ]);
        return { Users, countUser };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getUsers = getUsers;
const dashboard = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userQuery = {
            isDeleted: false,
        };
        const [countUser] = yield Promise.all([
            models_1.User.countDocuments(userQuery),
        ]);
        return { countUser };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.dashboard = dashboard;
