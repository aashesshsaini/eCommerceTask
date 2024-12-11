import { Document, Schema } from "mongoose";

export interface notificationDocument extends Document {
  userId: Schema.Types.ObjectId;
  jamId: Schema.Types.ObjectId;
  title: string;
  description: string;
  isDeleted: boolean;
}
