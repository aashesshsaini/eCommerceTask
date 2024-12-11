import mongoose, { Types, Document, Schema } from "mongoose";
import { STATUS, USER_TYPE, MESSAGE_TYPE } from "../config/appConstant";
import { ChatDocument } from "../interfaces/chat.interface";

const chatSchema = new Schema<ChatDocument>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "users",
      required: true,
    },
    receiver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "users",
        required: true,
      },
    ],
    jamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jams",
      required: true,
    },
    message: {
      type: String,
    },
    type: {
      type: String,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model<ChatDocument>("chats", chatSchema);

export default Chat;
