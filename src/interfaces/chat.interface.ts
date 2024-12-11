import { Types, Document, Schema } from "mongoose";
import { MESSAGE_TYPE } from "../config/appConstant";

export interface ChatDocument extends Document {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId[];
  message: string;
  type: keyof typeof MESSAGE_TYPE;
  jamId: Types.ObjectId;
  blocked?: Array<{
    blockedUser: Schema.Types.ObjectId;
    blockedMessage?: string;
    blockedTime?: Date;
    blockedMessageType?: keyof typeof MESSAGE_TYPE;
  }>;
  deletedFor?: Schema.Types.ObjectId[];
  seenBy?: Schema.Types.ObjectId[];
  isDeleted?: boolean;
}
