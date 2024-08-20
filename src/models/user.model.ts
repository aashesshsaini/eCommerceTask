import mongoose, {Types, Document, Schema} from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { UserDocument } from "../interfaces/user.interface";

const userSchema = new Schema<UserDocument>(
    {
        fullName: {
          type: String,
          trim: true,
        },
        email: {
          type: String,
        },
        password: {
          type: String,
        },
        profileImage: 
          {
            type: String,
          },
        mobileNumber: {
          type: Number,
        },
        countryCode:{
          type: String
        },
        isBlocked: {
          type: Boolean,
          default: false,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
        isVerified: {
          type: Boolean,
          default: false
        },
        isPayment: {
          type: Boolean,
          default: false,
        },
      },
      { timestamps: true }
)

const User = mongoose.model<UserDocument>("users", userSchema)

export default User