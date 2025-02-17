import socket, { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { AuthFailedError, OperationalError } from "../utils/error";
import { ERROR_MESSAGES, STATUS_CODES, USER_TYPE } from "../config/appConstant";
import Token from "../models/token.model";

let io: Server;
export const connectSocket = (server: any) => {
    const connectedUsers = new Map<string, string>(); // { userId: socketId }
    const adminSocket = { id: null as string | null }; // Store admin socket ID

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.query?.token as string | undefined;
            if (!token) {
                return next(
                    new AuthFailedError(
                        ERROR_MESSAGES.AUTHENTICATION_FAILED,
                        STATUS_CODES.AUTH_FAILED
                    ));
            }

            jwt.verify(token, config.jwt.secret, async (err: any, decoded: any) => {
                if (err) {
                    return next(
                        new AuthFailedError(
                            ERROR_MESSAGES.AUTHENTICATION_FAILED,
                            STATUS_CODES.AUTH_FAILED
                        ));
                }

                const tokenDoc = await Token.findOne({ token }).lean();
                if (!tokenDoc) {
                    return next(
                        new AuthFailedError(
                            ERROR_MESSAGES.AUTHENTICATION_FAILED,
                            STATUS_CODES.AUTH_FAILED
                        ));
                }

                const userId = tokenDoc.user.toString();
                socket.data = { decoded, userId, role: decoded.role };

                if (decoded.role === USER_TYPE.ADMIN) {
                    adminSocket.id = socket.id;
                    console.log(`[Socket] Admin connected: ${socket.id}`);
                } else {
                    connectedUsers.set(userId, socket.id);
                    console.log(`[Socket] User connected: ${userId} - ${socket.id}`);
                }

                next();
            });
        } catch (err) {
            next(err as Error);
        }
    });

    io.on("connection", (socket: Socket) => {
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

            if (role === USER_TYPE.ADMIN) {
                adminSocket.id = null;
                console.log("[Socket] Admin disconnected:", socket.id);
            } else if (userId && connectedUsers.has(userId)) {
                connectedUsers.delete(userId);
                console.log(`[Socket] User disconnected: ${userId}`);
            }
        });
    });
};
