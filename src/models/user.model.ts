import mongoose, {Types, Document, Schema} from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { UserDocument } from "../interfaces/user.interface";
import { string } from "joi";

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
        zipCode: {
          type: String
        },
         genre:{type: String},
         instrument: {type: String},
         commitmentLevel:{type: String},
         repertoire:[{
          type:String
         }],
         bio:{type: String},
         document:{type: String},
         proficient:{type: String},
         improvisationalSkill:{type: String},
         motivation:{type: String},
         aboutRepertoire:{type: String},
         publicExpirence:{type: String},
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