import { Document, ObjectId } from "mongoose";

export interface UserDocument extends Document {
    fullName:string,
    email:string,
    password:string,
    profileImage:string,
    mobileNumber:string,
    countryCode:string,
    zipCode:string,
    genre:string,
    instrument:string,
    commitmentLevel:string,
    repertoire:string[],
    bio:string,
    document:string,
    proficient:string,
    improvisationalSkill:string,
    motivation:string,
    aboutRepertoire:string,
    publicExpirence:string,
    favMembers:ObjectId[],
    isBlocked:boolean,
    isDeleted:boolean,
    isVerified:boolean,
    isRegistered:boolean,
    isPayment:boolean,
}
