import mongoose, { Types, Document, Schema } from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { notificationDocument } from "../interfaces/notification.interface";

const notificationSchema = new Schema<notificationDocument>(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
    },
    jamId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "jams",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<notificationDocument>(
  "notifications",
  notificationSchema
);

export default Notification;
