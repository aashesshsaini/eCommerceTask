import socket, { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { AuthFailedError, OperationalError } from "../utils/error";
import { ERROR_MESSAGES, STATUS_CODES, USER_TYPE } from "../config/appConstant";
import Token from "../models/token.model";
import { Document, Schema } from "mongoose";
import { socketService } from "../services";
import { ObjectId } from "mongoose";
import { Dictionary } from "../types";
import { TokenDocument } from "../interfaces";
import sendPushNotification from "./sendPushNotification";

let io: Server;

export const connectSocket = (server: Dictionary) => {
  const userCache = new Map<string, Map<string, string[]>>();
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.query?.token as string | undefined;
      const jamId = socket.handshake.query?.jamId as string | undefined;

      if (!token) {
        throw new AuthFailedError(
          ERROR_MESSAGES.AUTHENTICATION_FAILED,
          STATUS_CODES.AUTH_FAILED
        );
      }

      jwt.verify(token, config.jwt.secret, async (err: any, decoded: any) => {
        if (err) {
          return next(
            new AuthFailedError(
              ERROR_MESSAGES.AUTHENTICATION_FAILED,
              STATUS_CODES.AUTH_FAILED
            )
          );
        }

        const tokenDoc = (await Token.findOne({
          token,
        }).lean()) as TokenDocument;
        if (!tokenDoc) {
          return next(
            new AuthFailedError(
              ERROR_MESSAGES.AUTHENTICATION_FAILED,
              STATUS_CODES.AUTH_FAILED
            )
          );
        }

        const userId = tokenDoc.user as ObjectId;
        socket.data = { decoded, userId }; // Attach data for easy access

        if (jamId) {
          const jamIdStr = jamId.toString();
          if (!userCache.has(jamIdStr)) {
            userCache.set(
              jamIdStr,
              new Map([[userId.toString(), [socket.id]]])
            );
          } else {
            const conversation = userCache.get(jamIdStr);

            if (conversation) {
              const userSockets = conversation.get(userId.toString()) || [];
              userSockets.push(socket.id);
              conversation.set(userId.toString(), userSockets);
            }
          }
        }

        return next();
      });
    } catch (err) {
      next(err as Error);
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("connedcted............................");
    socket.on("sendMessage", async (data) => {
      try {
        const { message, type, jamId } = data;
        // console.log(data);
        if (!message && !type && !jamId) {
          throw new AuthFailedError(
            "Data is missing",
            STATUS_CODES.ACTION_FAILED
          );
        }

        const jam = await socketService.getJam(data.jamId);
        if (!jam) {
          throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.JAM_NOT_FOUND
          );
        }

        const senderId = socket.data.userId;
        const receiverIds = jam.members;

        console.log(senderId, "senderId", "\n", receiverIds, "receiverIds");

        const messageData = await socketService.saveMessage(
          senderId,
          receiverIds,
          jamId,
          message,
          type
        );

        console.log(messageData);

        const deviceTokens = await socketService.getReceiver(
          receiverIds,
          senderId
        );

        const { sender, receiver } = await socketService.getUsers(
          senderId,
          receiverIds
        );

        console.log(
          sender,
          "sender.................",
          "\n",
          receiver,
          "receiver............"
        );

        if (!receiver) {
          throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.AUTHENTICATION_FAILED
          );
        }

        const body =
          type === "image"
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
        sendPushNotification(
          "New Message",
          deviceTokens,
          body.message,
          body.jamId,
          sender?.firstName
        );

        const conversationUsers = userCache.get(data.jamId.toString());
        if (conversationUsers) {
          for (const [userId, socketIds] of conversationUsers) {
            socketIds.forEach((socketId) => {
              io.to(socketId).emit("receiveMessage", messageData);
            });
          }
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("isTyping", async (data) => {
      try {
        const { userId } = data;
        if (!userId) {
          throw new AuthFailedError(
            "Data is missing",
            STATUS_CODES.ACTION_FAILED
          );
        }

        const senderId = socket.data.userId;
        // const blocked = await socketService.blocked(senderId, userId);

        const receiverCache = userCache.get(userId.toString());
        // if (!blocked && receiverCache) {
        if (receiverCache) {
          receiverCache.forEach((socketId) =>
            io.to(socketId).emit("isTyping", data.typing)
          );
        }
      } catch (err) {
        console.error("Error in isTyping:", err);
      }
    });

    socket.on("leaveConversation", async () => {
      const conversationId = socket.handshake.query?.conversationId as string;
      const userId = socket.data.userId.toString();

      const conversation = userCache.get(conversationId);
      if (conversation && conversation.has(userId)) {
        const userSockets = conversation.get(userId) ?? [];
        conversation.set(
          userId,
          userSockets.filter((socketId) => socketId !== socket.id)
        );

        if (conversation.get(userId)?.length === 0) {
          conversation.delete(userId);
        }

        if (conversation.size === 0) {
          userCache.delete(conversationId);
        }
      }

      console.log("Disconnected:", socket.id, userCache);
    });
  });
};
