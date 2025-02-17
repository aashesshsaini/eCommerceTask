import mongoose, { Types, Document, Schema } from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { UserDocument } from "../interfaces/user.interface";
import { string } from "joi";

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    stripeCustomerId: { type: String },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("users", userSchema);

export default User;
