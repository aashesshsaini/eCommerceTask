import { Chat, User, Token, Jam, Notification } from "../../models";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
  USER_TYPE,
  STATUS,
} from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import config from "../../config/config";
import { Dictionary } from "../../types";
import { TokenDocument } from "../../interfaces/token.interface";
import { ObjectId } from "mongoose";
import { JamDocument } from "../../interfaces";
import { paginationOptions } from "../../utils/universalFunctions";

const getJam = async (jamId: ObjectId) => {
  const [jamData] = await Promise.all([
    Jam.findOne({
      _id: jamId,
      isDeleted: false,
    }) as Dictionary,
  ]);

  return jamData;
};

const saveMessage = async (
  senderId: ObjectId,
  receiverIds: ObjectId,
  jamId: ObjectId,
  message: string,
  type: string
) => {
  let [data] = await Promise.all([
    Chat.create({
      sender: senderId,
      receiver: receiverIds,
      jamId,
      message,
      type,
    }),
  ]);
  console.log(data);

  return data;
};

const getReceiver = async (receiverId: ObjectId[], senderId: ObjectId) => {
  const filteredReceiverId = receiverId.filter((userId) => userId !== senderId);

  const deviceTokens = await Token.find({
    user: { $in: filteredReceiverId },
  }).distinct("device.token");

  return deviceTokens;
};

const getUsers = async (senderId: ObjectId, receiverId: ObjectId) => {
  let sender = null;
  let receiver = null;
  [sender, receiver] = await Promise.all([
    User.findById(senderId),
    User.find({ _id: receiverId }).distinct("_id") as Dictionary,
  ]);
  return { sender, receiver };
};

const notificationListing = async (
  query: Dictionary,
  tokenData: Dictionary
) => {
  const { page, limit } = query;
  console.log(tokenData, "tokenData..............");
  const [notificationListing, notificationCount] = await Promise.all([
    Notification.find(
      {
        isDeleted: false,
        professionalId: tokenData.user,
      },
      {},
      paginationOptions(page, limit)
    ),
    Notification.countDocuments({
      isDeleted: false,
      professionalId: tokenData.professional,
    }),
  ]);
  return { notificationListing, notificationCount };
};
const getChats = async (query: Dictionary) => {
  const { page, limit, jamId } = query;
  const skip = page * limit;
  const [chatListing, chatCount] = await Promise.all([
    Chat.find({ jamId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Chat.countDocuments({ jamId, isDeleted: false }),
  ]);

  console.log(chatListing, "chatListing...........");
  return { chatListing: chatListing.reverse(), chatCount };
};

export {
  getJam,
  saveMessage,
  getReceiver,
  getUsers,
  notificationListing,
  getChats,
};
