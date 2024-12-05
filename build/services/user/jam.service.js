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
    const { jamName, availableDates, genre, repertoire, commitmentLevel, image, bandFormation, 
    // city,
    // region,
    landmark, longitude, latitude, description, allowMusicians, notifyFavMusicians, level, tryMyLuck } = body;
    const address = `${landmark}`;
    const qrCode = yield qrcode_1.default.toDataURL(address);
    const jamData = models_1.Jam.create({
        user,
        jamName,
        availableDates,
        genre,
        repertoire,
        commitmentLevel,
        image,
        bandFormation,
        // city,
        // region,
        landmark,
        loc: { type: "Point", coordinates: [longitude, latitude] },
        description,
        qrCode,
        allowMusicians,
        notifyFavMusicians,
        level,
        tryMyLuck
    });
    if (!jamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return jamData;
});
exports.jamCreate = jamCreate;
const jamGet = (query, user, timeZone) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, genre, date, startDate, endDate, search, latitude, longitude, commitmentLevel, instrument, distance, } = query;
    const currentUser = yield models_1.User.findById(user);
    const favMembers = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.favMembers) || [];
    var filter = {
        isDeleted: false,
        isCancelled: false,
        $or: [{ user: user }, { members: { $in: [user] } }],
    };
    var nearByJamsFilter = {
        isDeleted: false,
        isCancelled: false,
        allowMusicians: true,
        user: { $ne: user },
    };
    var hostedJamsFilter = {
        user,
        isDeleted: false,
    };
    var attendedJamsFilter = {
        members: { $in: [user] },
        isDeleted: false,
    };
    if (genre) {
        (filter = Object.assign(Object.assign({}, filter), { genre })),
            (nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { genre }));
    }
    if (date) {
        const dateInTimeZone = timeZone
            ? getDateInTimeZone(date, timeZone)
            : (0, moment_timezone_1.default)(date);
        const startOfDay = dateInTimeZone.startOf("day").toDate();
        const endOfDay = dateInTimeZone.endOf("day").toDate();
        filter = Object.assign(Object.assign({}, filter), { "availableDates.date": { $gte: startOfDay, $lte: endOfDay } });
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { "availableDates.date": { $gte: startOfDay, $lte: endOfDay } });
    }
    else {
        const today = timeZone
            ? getDateInTimeZone(new Date(), timeZone)
            : (0, moment_timezone_1.default)().startOf("day");
        const startOfToday = today.startOf("day").toDate();
        filter = Object.assign(Object.assign({}, filter), { "availableDates.date": { $gte: startOfToday } });
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { "availableDates.date": { $gte: startOfToday } });
    }
    if (startDate && endDate) {
        const start = timeZone
            ? getDateInTimeZone(startDate, timeZone)
            : (0, moment_timezone_1.default)(startDate).startOf("day");
        const end = timeZone
            ? getDateInTimeZone(endDate, timeZone)
            : (0, moment_timezone_1.default)(endDate).endOf("day");
        console.log(start, end); // Check the start and end dates after processing
        filter = Object.assign(Object.assign({}, filter), { "availableDates.date": Object.assign(Object.assign({}, (start ? { $gte: start.startOf("day").toDate() } : {})), (end ? { $lte: end.endOf("day").toDate() } : {})) });
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { "availableDates.date": Object.assign(Object.assign({}, (start ? { $gte: start.startOf("day").toDate() } : {})), (end ? { $lte: end.endOf("day").toDate() } : {})) });
    }
    if (latitude && longitude) {
        console.log(latitude, "latitude.........", longitude, "longitude.........");
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { loc: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: distance ? distance * 1000 : 10000,
                    // $minDistance: 0,
                },
            } });
    }
    console.log(nearByJamsFilter, "nearByJamsFilter.............");
    if (commitmentLevel) {
        (filter = Object.assign(Object.assign({}, filter), { commitmentLevel })),
            (nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { commitmentLevel }));
    }
    if (instrument) {
        filter = Object.assign(Object.assign({}, filter), { bandFormation: {
                $elemMatch: { instrument: instrument },
            } });
        nearByJamsFilter = Object.assign(Object.assign({}, nearByJamsFilter), { bandFormation: {
                $elemMatch: { instrument: instrument },
            } });
    }
    if (search) {
        const trimmedSearch = search.trim();
        const matchingUsers = yield models_1.User.find({
            firstName: { $regex: RegExp(trimmedSearch, "i") },
            lastName: { $regex: RegExp(trimmedSearch, "i") },
        });
        const matchingUserIds = matchingUsers.map((user) => user._id);
        filter = Object.assign(Object.assign({}, filter), { $or: [
                { jamName: { $regex: RegExp(trimmedSearch, "i") } },
                { genre: { $regex: RegExp(trimmedSearch, "i") } },
                { commitmentLevel: { $regex: RegExp(trimmedSearch, "i") } },
                { "bandFormation.instrument": { $regex: RegExp(trimmedSearch, "i") } },
                { members: { $in: matchingUserIds } },
            ] });
    }
    console.log(filter, "filter,,,,,,,,,,,,,");
    const [jams, jamsCount, nearByJams, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount,] = yield Promise.all([
        models_1.Jam.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit))
            .populate("user")
            .populate("members"),
        models_1.Jam.countDocuments(filter),
        models_1.Jam.find(nearByJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)).populate("user"),
        models_1.Jam.find(hostedJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)).populate("user"),
        models_1.Jam.countDocuments(hostedJamsFilter),
        models_1.Jam.find(attendedJamsFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)).populate("user"),
        models_1.Jam.countDocuments(attendedJamsFilter),
        // Jam.countDocuments(nearByJamsFilter),
    ]);
    console.log(nearByJams, "nearByJams...........");
    const addIsFav = (jamList) => {
        return jamList.map((jam) => (Object.assign(Object.assign({}, jam), { user: Object.assign(Object.assign({}, jam.user), { isFav: favMembers.includes(jam.user._id) ? true : false }) })));
    };
    const jamsWithFav = addIsFav(jams);
    const nearByJamsWithFav = addIsFav(nearByJams);
    const nearByJamsCount = nearByJams.length;
    return {
        jams: jamsWithFav,
        jamsCount,
        nearByJams: nearByJamsWithFav,
        nearByJamsCount,
        hostedJams,
        hostedJamsCount,
        attendedJams,
        attendedJamsCount,
    };
});
exports.jamGet = jamGet;
const jamUpdate = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId, jamName, availableDates, genre, repertoire, bandFormation, 
    // city,
    // region,
    landmark, commitmentLevel, image, description, allowMusicians, notifyFavMusicians, level, } = body;
    const jamUpdatedData = yield models_1.Jam.findOneAndUpdate({ _id: jamId, user, isDeleted: false }, {
        jamName,
        availableDates,
        genre,
        repertoire,
        bandFormation,
        // city,
        // region,
        landmark,
        commitmentLevel,
        image,
        description,
        allowMusicians,
        notifyFavMusicians,
        level,
    }, { lean: true, new: true });
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
const jamInfo = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { jamId } = query;
    const [jamData, userData] = yield Promise.all([
        models_1.Jam.findOne({ _id: jamId, isDeleted: false }).populate("user"),
        models_1.User.findById(userId),
    ]);
    if (!jamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    const isFav = (_a = userData === null || userData === void 0 ? void 0 : userData.favMembers) === null || _a === void 0 ? void 0 : _a.includes((_b = jamData.user) === null || _b === void 0 ? void 0 : _b._id);
    console.log(isFav, "isFav..............");
    return Object.assign(Object.assign({}, jamData._doc), { user: Object.assign(Object.assign({}, (_c = jamData === null || jamData === void 0 ? void 0 : jamData.user) === null || _c === void 0 ? void 0 : _c._doc), { isFav: isFav }) });
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
const getUsers = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, latitude, longitude, instrument, commitmentLevel, genre, jamId, } = query;
    let userQuery = {
        isDeleted: false,
        isVerified: true,
        _id: { $ne: userId },
    };
    //  if(commitmentLevel){
    //      userQuery = {
    //     ...userQuery,
    //     commitmentLevel
    //   }
    //  }
    if (instrument) {
        userQuery = Object.assign(Object.assign({}, userQuery), { instrument });
    }
    if (genre) {
        userQuery = Object.assign(Object.assign({}, userQuery), { genre });
    }
    if (search) {
        userQuery = Object.assign(Object.assign({}, userQuery), { $or: [
                { fullName: { $regex: RegExp(search, "i") } },
                { email: { $regex: RegExp(search, "i") } },
            ] });
    }
    // console.log(userQuery, "suerQuery...........");
    let jamInvitedMembers = [];
    if (jamId) {
        const jam = yield models_1.Jam.findById(jamId).select("invitedMembers").lean();
        if (jam) {
            console.log(jam, "jam.............");
            jamInvitedMembers = jam.invitedMembers.map((member) => member.toString());
        }
    }
    const [Users, countUser, userData] = yield Promise.all([
        models_1.User.find(userQuery, { password: 0 }, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.User.countDocuments(userQuery),
        models_1.User.findById(userId).select("favMembers"),
    ]);
    //  if(!Users || countUser===0){
    //   throw new OperationalError(
    //     STATUS_CODES.ACTION_FAILED,
    //     ERROR_MESSAGES.USER_NOT_FOUND
    //   )
    //  }
    console.log(userData, "userData...........`");
    const updatedUsers = yield Promise.all(Users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const isFav = (_a = userData === null || userData === void 0 ? void 0 : userData.favMembers) === null || _a === void 0 ? void 0 : _a.includes(user._id);
        const hostedJamsFilter = { user: user._id, isDeleted: false };
        const [hostedJams, hostedJamsCount] = yield Promise.all([
            models_1.Jam.find(hostedJamsFilter),
            models_1.Jam.countDocuments(hostedJamsFilter),
        ]);
        const attendedJamsFilter = {
            members: { $in: [user._id] },
            isDeleted: false,
        };
        const [attendedJams, attendedJamsCount] = yield Promise.all([
            models_1.Jam.find(attendedJamsFilter),
            models_1.Jam.countDocuments(attendedJamsFilter),
        ]);
        console.log(user._id, "user._id", "/n", typeof user._id);
        const isInvited = jamId
            ? jamInvitedMembers.includes(user._id.toString())
            : undefined;
        console.log(isInvited, "isInvited.........");
        return Object.assign(Object.assign(Object.assign({}, user), { isFav,
            hostedJams,
            hostedJamsCount,
            attendedJams,
            attendedJamsCount }), (jamId && { isInvited }));
    })));
    // console.log(updatedUsers);
    return { Users: updatedUsers, countUser };
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
// const favMemberGet = async (query: Dictionary, userId: ObjectId) => {
//   const { page, limit, search, jamId } = query;
//   const matchCondition: Dictionary = {};
//   if (search) {
//     const trimmedSearch = search.trim();
//     matchCondition.$or = [
//       { firstName: { $regex: trimmedSearch, $options: "i" } },
//       { lastName: { $regex: trimmedSearch, $options: "i" } },
//     ];
//   }
//   let jamInvitedMembers: string[] = [];
//   if (jamId) {
//     const jam = await Jam.findById(jamId).select("invitedMembers").lean();
//     if (jam) {
//       console.log(jam, "jam.............");
//       jamInvitedMembers = jam.invitedMembers.map((member) => member.toString());
//     }
//   }
//   const favMemList = await User.findById(userId, { favMembers: 1, _id: 0 })
//     .populate({
//       path: "favMembers",
//       match: matchCondition,
//       options: {
//         limit: limit,
//         skip: page * limit,
//       },
//     })
//     .lean();
//   // const favMemCount = await User.findById(userId).countDocuments({ favMembers: { $exists: true, $not: { $size: 0 } } });
//   const favMemCount = favMemList?.favMembers?.length;
//   const favMembers = favMemList?.favMembers || [];
//  const favMemListWithIsInvited = favMembers.map((favMember) => ({
//    ...favMember,
//    isInvited: jamId
//      ? jamInvitedMembers.includes(favMember._id.toString())
//      : undefined,
//  }));
//   return { favMemList: favMemListWithIsInvited, favMemCount };
// };
const favMemberGet = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, jamId } = query;
    // Build search condition
    const matchCondition = {};
    if (search) {
        const trimmedSearch = search.trim();
        matchCondition.$or = [
            { firstName: { $regex: trimmedSearch, $options: "i" } },
            { lastName: { $regex: trimmedSearch, $options: "i" } },
        ];
    }
    // Get invited members of the Jam
    let jamInvitedMembers = [];
    if (jamId) {
        const jam = yield models_1.Jam.findById(jamId).select("invitedMembers").lean();
        if (jam) {
            jamInvitedMembers = jam.invitedMembers.map((member) => member.toString());
        }
    }
    // Fetch favorite members
    const userWithFavMembers = yield models_1.User.findById(userId, {
        favMembers: 1,
        _id: 0,
    })
        .populate({
        path: "favMembers",
        match: matchCondition,
        options: {
            limit: limit,
            skip: page * limit,
        },
    })
        .lean();
    const favMembers = (userWithFavMembers === null || userWithFavMembers === void 0 ? void 0 : userWithFavMembers.favMembers) || [];
    const favMemCount = favMembers.length;
    const favMemListWithIsInvited = favMembers.map((favMember) => (Object.assign(Object.assign({}, favMember), { isInvited: jamId
            ? jamInvitedMembers.includes(favMember._id.toString())
            : undefined })));
    return { favMemList: favMemListWithIsInvited, favMemCount };
});
exports.favMemberGet = favMemberGet;
const inviteMembers = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { memberId, jamId } = body;
    const validmemberId = Array.isArray(memberId) ? memberId : [];
    console.log(memberId, "....................");
    const [deviceTokens, jamData] = yield Promise.all([
        models_1.Token.find({
            user: { $in: memberId },
            isDeleted: false,
        }).distinct("device.token"),
        models_1.Jam.findOneAndUpdate({ _id: jamId, isDeleted: false }, { $addToSet: { invitedMembers: { $each: validmemberId } } }, { new: true }),
    ]);
    console.log(jamData, "jamData............");
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
