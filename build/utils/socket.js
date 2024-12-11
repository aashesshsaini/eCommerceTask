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
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const error_1 = require("../utils/error");
const appConstant_1 = require("../config/appConstant");
const token_model_1 = __importDefault(require("../models/token.model"));
const services_1 = require("../services");
const sendPushNotification_1 = __importDefault(require("./sendPushNotification"));
let io;
const connectSocket = (server) => {
    const userCache = new Map();
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const token = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.token;
            const jamId = (_b = socket.handshake.query) === null || _b === void 0 ? void 0 : _b.jamId;
            if (!token) {
                throw new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED);
            }
            jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
                }
                const tokenDoc = (yield token_model_1.default.findOne({
                    token,
                }).lean());
                if (!tokenDoc) {
                    return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
                }
                const userId = tokenDoc.user;
                socket.data = { decoded, userId }; // Attach data for easy access
                if (jamId) {
                    const jamIdStr = jamId.toString();
                    if (!userCache.has(jamIdStr)) {
                        userCache.set(jamIdStr, new Map([[userId.toString(), [socket.id]]]));
                    }
                    else {
                        const conversation = userCache.get(jamIdStr);
                        if (conversation) {
                            const userSockets = conversation.get(userId.toString()) || [];
                            userSockets.push(socket.id);
                            conversation.set(userId.toString(), userSockets);
                        }
                    }
                }
                return next();
            }));
        }
        catch (err) {
            next(err);
        }
    }));
    io.on("connection", (socket) => {
        console.log("connedcted............................");
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { message, type, jamId } = data;
                // console.log(data);
                if (!message && !type && !jamId) {
                    throw new error_1.AuthFailedError("Data is missing", appConstant_1.STATUS_CODES.ACTION_FAILED);
                }
                const jam = yield services_1.socketService.getJam(data.jamId);
                if (!jam) {
                    throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
                }
                const senderId = socket.data.userId;
                const receiverIds = jam.members;
                console.log(senderId, "senderId", "\n", receiverIds, "receiverIds");
                const messageData = yield services_1.socketService.saveMessage(senderId, receiverIds, jamId, message, type);
                console.log(messageData);
                const deviceTokens = yield services_1.socketService.getReceiver(receiverIds, senderId);
                const { sender, receiver } = yield services_1.socketService.getUsers(senderId, receiverIds);
                console.log(sender, "sender.................", "\n", receiver, "receiver............");
                if (!receiver) {
                    throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED);
                }
                const body = type === "image"
                    ? {
                        message: "image",
                        receiver: sender,
                        sender: { _id: receiver._id },
                        jamId: jam._id,
                    }
                    : {
                        message: messageData.message,
                        receiver: sender,
                        sender: { _id: receiver._id },
                        jamId: jam._id,
                    };
                (0, sendPushNotification_1.default)("New Message", deviceTokens, body.message, body.jamId, sender === null || sender === void 0 ? void 0 : sender.firstName);
                const conversationUsers = userCache.get(data.jamId.toString());
                if (conversationUsers) {
                    for (const [userId, socketIds] of conversationUsers) {
                        socketIds.forEach((socketId) => {
                            io.to(socketId).emit("receiveMessage", messageData);
                        });
                    }
                }
            }
            catch (err) {
                console.error("Error sending message:", err);
            }
        }));
        socket.on("isTyping", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { userId } = data;
                if (!userId) {
                    throw new error_1.AuthFailedError("Data is missing", appConstant_1.STATUS_CODES.ACTION_FAILED);
                }
                const senderId = socket.data.userId;
                // const blocked = await socketService.blocked(senderId, userId);
                const receiverCache = userCache.get(userId.toString());
                // if (!blocked && receiverCache) {
                if (receiverCache) {
                    receiverCache.forEach((socketId) => io.to(socketId).emit("isTyping", data.typing));
                }
            }
            catch (err) {
                console.error("Error in isTyping:", err);
            }
        }));
        socket.on("leaveConversation", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const conversationId = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.conversationId;
            const userId = socket.data.userId.toString();
            const conversation = userCache.get(conversationId);
            if (conversation && conversation.has(userId)) {
                const userSockets = (_b = conversation.get(userId)) !== null && _b !== void 0 ? _b : [];
                conversation.set(userId, userSockets.filter((socketId) => socketId !== socket.id));
                if (((_c = conversation.get(userId)) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                    conversation.delete(userId);
                }
                if (conversation.size === 0) {
                    userCache.delete(conversationId);
                }
            }
            console.log("Disconnected:", socket.id, userCache);
        }));
    });
};
exports.connectSocket = connectSocket;
