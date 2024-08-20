  import { Document, Schema, Types } from "mongoose";

export interface TokenDocument extends Document {
    token: string;
    user: Schema.Types.ObjectId;
    admin: Schema.Types.ObjectId;
    role: string;
    type: string;
    expires: Date;
    device: {
      type: string;
      token: string;
    };
  otp?:{
    code:string, 
    expiresAt:string
  };

    isDeleted: boolean;
    blacklisted: boolean;
  }