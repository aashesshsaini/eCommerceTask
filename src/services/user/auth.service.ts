import bcrypt from 'bcryptjs';
import { Admin, Token, User } from '../../models';
import { STATUS_CODES, ERROR_MESSAGES } from '../../config/appConstant';
import { OperationalError } from '../../utils/error';
// import Stripe from "stripe"
import config from "../../config/config"
import { Dictionary } from '../../types';
import { TokenDocument } from '../../interfaces/token.interface';
import { UserDocument } from '../../interfaces/user.interface';
import {forgotPasswordEmail} from "../../libs/sendMails"
import { ObjectId } from 'mongoose';

// const stripe = new Stripe(config.stripe.secretKey);

interface signupBody {
    fullName:string;
    countryCode: string;
    mobileNumber:string;
    email: string;
    password: string;
  }

const signup = async(body:signupBody)=>{
    const { email, password, fullName, mobileNumber, countryCode } = body;
    const existinguser = await User.findOne({ email: email });
    if (existinguser) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST
      );
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword,fullName, mobileNumber, countryCode});
    
    await user.save();
  
    return user;
}

interface loginBody {
    email: string;
    password: string;
  }

  const verifyOtp = async (code:string, tokenId:ObjectId) => {
    const tokenData = await Token.findOne({ _id: tokenId, isDeleted: false }) as TokenDocument;
    console.log(code)
    if (tokenData?.otp?.code !== code) {
      throw new OperationalError(STATUS_CODES.ACTION_FAILED, "OTP is Incorrect");
    }
    const userData = await User.findByIdAndUpdate(
      tokenData.user,
      { isVerified: true },
      { lean: true, new: true }
    );
  };

const login = async(body:loginBody)=>{
    const {email, password} =  body
    const user = await User.findOne({email:email})
    if(!user){
        throw new OperationalError(
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND
        )
    }
    if(user.isBlocked){
      throw new OperationalError(
          STATUS_CODES.NOT_FOUND,
          ERROR_MESSAGES.ACCOUNT_BLOCKED
      )
  }
  if(user.isDeleted){
    throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ACCOUNT_DELETED
    )
}
    const matchPassword = await bcrypt.compare(password, user.password)

    if(!matchPassword){
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.WRONG_PASSWORD
        )
    }
    return user
}

interface changePasswordBody {
    newPassword: string;
    oldPassword: string;
  }

const changePassword = async(body:changePasswordBody, token:TokenDocument)=>{
    const {newPassword, oldPassword} = body
    const user = await User.findById(token?.user)
    if(!user){
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.USER_NOT_FOUND
        )
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password)
    console.log(passwordMatch)
    if(!passwordMatch){
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      )
    }
    const userNewPassword = await bcrypt.hash(newPassword, 10)
    const updatePassword = {password:userNewPassword}
    Object.assign(user, updatePassword)
    await user.save()
    return user
}

const logout = async(userId:ObjectId)=>{
   await Token.updateMany({user:userId},{isDeleted:false})
}

const editProfile = async(user:ObjectId, body:UserDocument)=>{
  const {fullName, profileImage} = body
  const updatedProfileData = await User.findByIdAndUpdate(user, {fullName, profileImage},{lean:true,new:true})
  if(!updatedProfileData){
   throw new OperationalError(
    STATUS_CODES.NOT_FOUND,
    ERROR_MESSAGES.USER_NOT_FOUND
   )
  }
  return updatedProfileData
}

const forgotPassword = async(token:TokenDocument, body:UserDocument)=>{
  const {email} = body
  const userData = await User.findById(token?.user)
  console.log(userData, "userData...........")
  if(userData?.email !== email){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      "please fill personal email"
    )
  }
  await forgotPasswordEmail(email, token?.token)
}

const resetPassword = async(userId:ObjectId, newPassword:string)=>{
  console.log(newPassword, 'newPasword.............')
   const hashedPassword = await bcrypt.hash(newPassword, 10)
   console.log(hashedPassword)
  const userData = await User.findOneAndUpdate({_id:userId},{$set:{password:hashedPassword}},{lean:true,new:true})
  return userData
}

export { signup, verifyOtp, login, changePassword, logout, editProfile, forgotPassword, resetPassword};