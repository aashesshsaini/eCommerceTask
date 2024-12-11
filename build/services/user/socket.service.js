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
exports.getChats = exports.notificationListing = exports.getUsers = exports.getReceiver = exports.saveMessage = exports.getJam = void 0;
const models_1 = require("../../models");
const universalFunctions_1 = require("../../utils/universalFunctions");
const getJam = (jamId) => __awaiter(void 0, void 0, void 0, function* () {
    const [jamData] = yield Promise.all([
        models_1.Jam.findOne({
            _id: jamId,
            isDeleted: false,
        }),
    ]);
    return jamData;
});
exports.getJam = getJam;
const saveMessage = (senderId, receiverIds, jamId, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    let [data] = yield Promise.all([
        models_1.Chat.create({
            sender: senderId,
            receiver: receiverIds,
            jamId,
            message,
            type,
        }),
    ]);
    console.log(data);
    return data;
});
exports.saveMessage = saveMessage;
const getReceiver = (receiverId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const filteredReceiverId = receiverId.filter((userId) => userId !== senderId);
    const deviceTokens = yield models_1.Token.find({
        user: { $in: filteredReceiverId },
    }).distinct("device.token");
    return deviceTokens;
});
exports.getReceiver = getReceiver;
const getUsers = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    let sender = null;
    let receiver = null;
    [sender, receiver] = yield Promise.all([
        models_1.User.findById(senderId),
        models_1.User.find({ _id: receiverId }).distinct("_id"),
    ]);
    return { sender, receiver };
});
exports.getUsers = getUsers;
const notificationListing = (query, tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    console.log(tokenData, "tokenData..............");
    const [notificationListing, notificationCount] = yield Promise.all([
        models_1.Notification.find({
            isDeleted: false,
            professionalId: tokenData.user,
        }, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Notification.countDocuments({
            isDeleted: false,
            professionalId: tokenData.professional,
        }),
    ]);
    return { notificationListing, notificationCount };
});
exports.notificationListing = notificationListing;
const getChats = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, jamId } = query;
    const skip = page * limit;
    const [chatListing, chatCount] = yield Promise.all([
        models_1.Chat.find({ jamId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.Chat.countDocuments({ jamId, isDeleted: false }),
    ]);
    console.log(chatListing, "chatListing...........");
    return { chatListing: chatListing.reverse(), chatCount };
});
exports.getChats = getChats;
