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
exports.jamDelete = exports.jamUpdate = exports.jamGet = exports.jamCreate = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const qrcode_1 = __importDefault(require("qrcode"));
const getDateInTimeZone = (date, timeZone) => {
    return moment_timezone_1.default.tz(date, timeZone);
};
const jamCreate = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians } = body;
    const address = `${city}, ${region}, ${landmark}`;
    const qrCode = yield qrcode_1.default.toDataURL(address);
    const jamData = models_1.Jam.create({ user, jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, qrCode, allowMusicians, notifyFavMusicians });
    if (!jamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return jamData;
});
exports.jamCreate = jamCreate;
const jamGet = (query, user, timeZone) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, genre, date, search, latitude, longitude } = query;
    var filter = { isDeleted: false };
    if (genre) {
        filter = Object.assign(Object.assign({}, filter), { genre });
    }
    if (date) {
        const dateInTimeZone = timeZone ? getDateInTimeZone(date, timeZone) : (0, moment_timezone_1.default)(date);
        const formatedDate = dateInTimeZone.format("YYYY-MM-DD");
        filter = Object.assign(Object.assign({}, filter), { date: formatedDate });
    }
    else {
        const today = timeZone ? getDateInTimeZone(new Date(), timeZone) : (0, moment_timezone_1.default)().startOf('day');
        const formattedToday = today.format("YYYY-MM-DD");
        filter = Object.assign(Object.assign({}, filter), { date: { $gte: formattedToday } });
    }
    if (latitude && longitude) {
        filter = Object.assign(Object.assign({}, filter), { $near: {
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
    const [jams, jamsCount] = yield Promise.all([
        models_1.Jam.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(filter)
    ]);
    return { jams, jamsCount };
});
exports.jamGet = jamGet;
const jamUpdate = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId, jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians } = body;
    const jamUpdatedData = yield models_1.Jam.findOneAndUpdate({ _id: jamId, user, isDeleted: false }, { jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians }, { lean: true, new: true });
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
