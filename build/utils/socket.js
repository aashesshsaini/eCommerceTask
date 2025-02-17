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
let io;
const connectSocket = (server) => {
    const connectedUsers = new Map(); // { userId: socketId }
    const adminSocket = { id: null }; // Store admin socket ID
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
            }
            jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
                }
                const tokenDoc = yield token_model_1.default.findOne({ token }).lean();
                if (!tokenDoc) {
                    return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
                }
                const userId = tokenDoc.user.toString();
                socket.data = { decoded, userId, role: decoded.role };
                if (decoded.role === appConstant_1.USER_TYPE.ADMIN) {
                    adminSocket.id = socket.id;
                    console.log(`[Socket] Admin connected: ${socket.id}`);
                }
                else {
                    connectedUsers.set(userId, socket.id);
                    console.log(`[Socket] User connected: ${userId} - ${socket.id}`);
                }
                next();
            }));
        }
        catch (err) {
            next(err);
        }
    }));
    io.on("connection", (socket) => {
        console.log("[Socket] New connection established:", socket.id);
        socket.on("placeOrder", (orderData) => {
            const { userId, orderId } = orderData;
            if (!userId || !orderId) {
                console.log("[Socket] placeOrder error: Missing data", orderData);
                return socket.emit("error", { message: "Order data is missing" });
            }
            console.log(`[Socket] Order placed: User - ${userId}, Order - ${orderId}`);
            const userSocketId = connectedUsers.get(userId);
            if (userSocketId) {
                io.to(userSocketId).emit("orderNotification", {
                    message: "Your order has been placed!",
                    orderId,
                });
            }
            if (adminSocket.id) {
                io.to(adminSocket.id).emit("adminNotification", {
                    message: "New order received!",
                    orderId,
                    userId,
                });
            }
        });
        socket.on("disconnect", () => {
            const { userId, role } = socket.data || {};
            if (role === appConstant_1.USER_TYPE.ADMIN) {
                adminSocket.id = null;
                console.log("[Socket] Admin disconnected:", socket.id);
            }
            else if (userId && connectedUsers.has(userId)) {
                connectedUsers.delete(userId);
                console.log(`[Socket] User disconnected: ${userId}`);
            }
        });
    });
};
exports.connectSocket = connectSocket;
