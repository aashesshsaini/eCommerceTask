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
exports.acceptJam = exports.inviteMembers = exports.favMemberGet = exports.favMember = exports.getUsers = exports.cancelJam = exports.jamInfo = exports.jamDelete = exports.jamUpdate = exports.jamGet = exports.jamCreate = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const qrcode_1 = __importDefault(require("qrcode"));
// import sendPushNotification from '../../utils/notification';
const getDateInTimeZone = (date, timeZone) => {
    return moment_timezone_1.default.tz(date, timeZone);
};
const jamCreate = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamName, availableDates, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians } = body;
    const address = `${city}, ${region}, ${landmark}`;
    const qrCode = yield qrcode_1.default.toDataURL(address);
    const jamData = models_1.Jam.create({ user, jamName, availableDates, genre, repertoire, bandFormation, city, region, landmark, description, qrCode, allowMusicians, notifyFavMusicians });
    if (!jamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return jamData;
});
exports.jamCreate = jamCreate;
const jamGet = (query, user, timeZone) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, genre, date, search, latitude, longitude } = query;
    var filter = {
        isDeleted: false,
        isCancelled: false,
        $or: [
            { user: user },
            { members: { $in: [user] } }
        ]
    };
    var nearByJamsFilter = {
        isDeleted: false,
        isCancelled: false,
        allowMusicians: true
    };
    if (genre) {
        filter = Object.assign(Object.assign({}, filter), { genre }),
            nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { genre });
    }
    if (date) {
        const dateInTimeZone = timeZone ? getDateInTimeZone(date, timeZone) : (0, moment_timezone_1.default)(date);
        const startOfDay = dateInTimeZone.startOf('day').toDate();
        const endOfDay = dateInTimeZone.endOf('day').toDate();
        filter = Object.assign(Object.assign({}, filter), { 'availableDates.date': { $gte: startOfDay, $lte: endOfDay } });
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { 'availableDates.date': { $gte: startOfDay, $lte: endOfDay } });
    }
    else {
        const today = timeZone ? getDateInTimeZone(new Date(), timeZone) : (0, moment_timezone_1.default)().startOf('day');
        const startOfToday = today.startOf('day').toDate();
        filter = Object.assign(Object.assign({}, filter), { 'availableDates.date': { $gte: startOfToday } });
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { 'availableDates.date': { $gte: startOfToday } });
    }
    if (latitude && longitude) {
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: 10000,
                $minDistance: 0
            } });
    }
    if (search) {
        filter = Object.assign(Object.assign({}, filter), { $or: [
                { jamName: { $regex: RegExp(search, "i") } },
            ] });
    }
    console.log(filter, "filter,,,,,,,,,,,,,");
    const [jams, jamsCount, nearByJams, nearByJamsCount] = yield Promise.all([
        models_1.Jam.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(filter),
        models_1.Jam.find(nearByJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(),
    ]);
    return { jams, jamsCount, nearByJams, nearByJamsCount };
});
exports.jamGet = jamGet;
const jamUpdate = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId, jamName, availableDates, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians } = body;
    const jamUpdatedData = yield models_1.Jam.findOneAndUpdate({ _id: jamId, user, isDeleted: false }, { jamName, availableDates, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians }, { lean: true, new: true });
    if (!jamUpdatedData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return jamUpdatedData;
});
exports.jamUpdate = jamUpdate;
const jamDelete = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId } = query;
    const deletedJam = yield models_1.Jam.findOneAndUpdate({ _id: jamId, user, isDeleted: false }, { $set: { isDeleted: true } }, { lean: true, new: true });
    if (!deletedJam) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
});
exports.jamDelete = jamDelete;
const jamInfo = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId } = query;
    const jamData = yield models_1.Jam.findOne({ _id: jamId, isDeleted: false });
    if (!jamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return jamData;
});
exports.jamInfo = jamInfo;
const cancelJam = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId } = body;
    const cancelledJamData = yield models_1.Jam.findOneAndUpdate({ _id: jamId, user: userId, isDeleted: false, isCancelled: false }, { isCancelled: true }, { lean: true, new: true });
    if (!cancelledJamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return cancelledJamData;
});
exports.cancelJam = cancelJam;
const getUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search } = query;
    let userQuery = { isDeleted: false, isVerified: true };
    if (search) {
        userQuery = Object.assign(Object.assign({}, userQuery), { $or: [
                { fullName: { $regex: RegExp(search, "i") } },
                { email: { $regex: RegExp(search, "i") } },
            ] });
    }
    console.log(userQuery, "suerQuery...........");
    const [Users, countUser] = yield Promise.all([
        models_1.User.find(userQuery, { password: 0 }, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.User.countDocuments(userQuery)
    ]);
    if (!Users || countUser === 0) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.NOT_FOUND);
    }
    return { Users, countUser };
});
exports.getUsers = getUsers;
const favMember = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { favMemId } = body;
    const user = yield models_1.User.findOne({
        _id: userId,
        isDeleted: false,
    });
    if (user) {
        const isFavMember = user.favMembers.includes(favMemId);
        let updateUser;
        if (isFavMember) {
            updateUser = yield models_1.User.findByIdAndUpdate({ _id: userId, isBlocked: false }, { $pull: { favMembers: favMemId } }, { lean: true, new: true });
            return { message: "Removed from favorites" };
        }
        else {
            updateUser = yield models_1.User.findByIdAndUpdate({ _id: userId, isBlocked: false }, { $addToSet: { favMembers: favMemId } }, { lean: true, new: true });
            return { message: "Added to favorites" };
        }
    }
    else {
        return { message: "User not found or already deleted" };
    }
});
exports.favMember = favMember;
const favMemberGet = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    const favMemList = yield models_1.User.findById(userId, { favMembers: 1, _id: 0 }).populate({
        path: 'favMembers',
        options: {
            limit: limit,
            skip: page * limit,
        }
    })
        .lean();
    const favMemCount = yield models_1.User.findById(userId).countDocuments({ favMembers: { $exists: true, $not: { $size: 0 } } });
    return { favMemList, favMemCount };
});
exports.favMemberGet = favMemberGet;
const inviteMembers = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { members, jamId } = body;
    const [deviceTokens, jamData] = yield Promise.all([
        models_1.Token.find({
            user: { $in: members },
            isDeleted: false,
        }).distinct("device.token"),
        models_1.Jam.findOne({ _id: jamId, isDeleted: false })
    ]);
    //  sendPushNotification("invitation from the jam", "message", deviceTokens)
});
exports.inviteMembers = inviteMembers;
const acceptJam = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId, case: action } = body;
    switch (action) {
        case "accept":
            yield models_1.Jam.findOneAndUpdate({ _id: jamId, isDeleted: false }, { $addToSet: { members: userId } }, { lean: true, new: true });
            return { message: "User added to the jam successfully." };
        case "reject":
            return { message: "User added to the jam successfully." };
        default:
            return { message: "Invalid case action." };
    }
});
exports.acceptJam = acceptJam;
