import { Document } from "mongoose";

export interface UserDocument extends Document {
    fullName:string,
    email:string,
    password:string,
    profileImage:string,
    mobileNumber:number,
    countryCode:string,
    isBlocked:boolean,
    isDeleted:boolean,
    isVerified:boolean,
    isPayment:boolean,
}
