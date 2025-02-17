import mongoose, { Document, Schema, Types } from 'mongoose';
import { DEVICE_TYPE, USER_TYPE, TOKEN_TYPE } from '../config/appConstant';
import { TokenDocument } from '../interfaces/token.interface';


const tokenSchema = new Schema<TokenDocument>(
  {
    token: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    serviceProvider: { type: Schema.Types.ObjectId, ref: 'seviceProviders' },
    admin: { type: Schema.Types.ObjectId, ref: 'admins' },
    role: { type: String, enum: [...Object.values(USER_TYPE)], required: true },
    type: {
      type: String,
      enum: [...Object.values(TOKEN_TYPE)],
      required: true,
    },
    expires: { type: Date, required: true },
    device: {
      type: {
        type: String,
        enum: [...Object.values(DEVICE_TYPE)],
      },
      token: { type: String },
      id: { type: String }
    },
    otp: {
      code: String,
      expiresAt: Date
    },
    isDeleted: { type: Boolean, default: false },
    blacklisted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model<TokenDocument>('token', tokenSchema);

export default Token;
