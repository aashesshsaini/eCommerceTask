import bcrypt from 'bcryptjs';
import { Admin, Token, User, Jam } from '../../models';
import { STATUS_CODES, ERROR_MESSAGES } from '../../config/appConstant';
import { OperationalError } from '../../utils/error';
// import Stripe from "stripe"
import config from "../../config/config"
import { Dictionary } from '../../types';
import { TokenDocument } from '../../interfaces/token.interface';
import { UserDocument } from '../../interfaces/user.interface';
import {forgotPasswordEmail} from "../../libs/sendMails"
import { ObjectId } from 'mongoose';
import { paginationOptions } from '../../utils/universalFunctions';

// const stripe = new Stripe(config.stripe.secretKey);

interface signupBody {
    fullName:string;
    countryCode: string;
    mobileNumber:string;
    email: string;
    password: string;
  }

  interface createProfileBody {
    zipCode:string,
    profileImage:string,
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
  }

const signup = async(body:UserDocument)=>{
    const { email, password, firstName, lastName, mobileNumber, countryCode } = body;
    const [existinguserByEmail, existinguserByMobileNumber] = await Promise.all([
     User.findOne({ email: email, isDeleted:false, isVerified:true}),
     User.findOne({ mobileNumber: mobileNumber, isDeleted:false, isVerified:true}),
    ])

    if (existinguserByEmail) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST
      );
    }

      if (existinguserByMobileNumber) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.MOBILE_ALREADY_EXIST
      );
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword,firstName, lastName, mobileNumber, countryCode});
    
    await user.save();
  
    return user;
}

interface loginBody {
    email: string;
    password: string;
    mobileNumber:string;
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

  const resendOtp = async(userId:ObjectId)=>{
    console.log(userId, "userId........")
   const userData = await User.findById(userId).lean()   
   const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };
   const updateOtpInToken = await Token.findOneAndUpdate({user:userId, isDeleted:false}, {$set:{otp:otp}})
  }

  const createProfile = async(body:createProfileBody, userId:ObjectId)=>{
  const {zipCode, profileImage, genre, instrument, repertoire, document, bio, proficient, improvisationalSkill, motivation, aboutRepertoire, publicExpirence} = body
  console.log(body, "body..........")
  const updatedUser = await User.findByIdAndUpdate(userId, {zipCode, profileImage, genre, instrument, repertoire, document, bio, proficient, improvisationalSkill, motivation, aboutRepertoire, publicExpirence, isRegistered:true}, {lean:true, new:true})
  if(!updatedUser){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    )
  }
  return updatedUser
}

const login = async(body:Dictionary)=>{
    const {email, password, mobileNumber, page, limit} =  body
    console.log(body, "body............")
    if(email){
       var user = await User.findOne({email:email, isDeleted:false})
    }else{
     var user = await User.findOne({mobileNumber, isDeleted:false})
    }
   
    console.log(user)
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
  console.log(user, "user.........")
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
  var hostedJamsFilter: Dictionary = {
  user:user._id,
  isDeleted:false,
}

var attendedJamsFilter = {
  members: { $in: [user._id] },  
  isDeleted: false           
};

const [hostedJams, hostedJamsCount, attendedJams, attendedJamsCount] = await Promise.all([
    Jam.find(hostedJamsFilter, {}, paginationOptions(page, limit)),
    Jam.countDocuments(hostedJamsFilter),
    Jam.find(attendedJamsFilter, {},paginationOptions(page, limit)),
    Jam.countDocuments(attendedJamsFilter), 
  ])

    return {user, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount}
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

const deleteAccount = async(userId:ObjectId, query:Dictionary)=>{
  const {password} = query
  const user = await User.findById(userId) as UserDocument
   
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log(passwordMatch)
    if(!passwordMatch){
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      )
    }

  const [deletedUser, deletedToken] = await Promise.all([
    User.findByIdAndUpdate(userId, {isDeleted:true, isVerified:false},{lean:true, new:true}),
    Token.updateMany({user:userId},{isDeleted:false},{lean:true, new:true})
  ])
  if(!deletedUser){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
  )
  }
}

const logout = async(userId:ObjectId)=>{
   await Token.updateMany({user:userId},{isDeleted:false})
}

const editProfile = async(user:ObjectId, body:UserDocument)=>{
  const { email, firstName, lastName, mobileNumber, countryCode, zipCode, profileImage, genre, instrument, repertoire, document, bio} = body
  const updatedProfileData = await User.findByIdAndUpdate(user, { email, firstName, lastName, mobileNumber, countryCode ,zipCode, profileImage, genre, instrument, repertoire, document, bio},{lean:true,new:true})
  if(!updatedProfileData){
   throw new OperationalError(
    STATUS_CODES.NOT_FOUND,
    ERROR_MESSAGES.USER_NOT_FOUND
   )
  }
  return updatedProfileData
}

const editQuestionnaire = async(user:ObjectId, body:UserDocument)=>{
 const { proficient, improvisationalSkill, motivation, aboutRepertoire, publicExpirence} = body
 const updateQuestionnairedData = await User.findByIdAndUpdate(user, {proficient, improvisationalSkill, motivation, aboutRepertoire, publicExpirence},{lean:true, new:true})
 if(!updateQuestionnairedData){
  throw new OperationalError(
   STATUS_CODES.NOT_FOUND,
   ERROR_MESSAGES.USER_NOT_FOUND
  )
 }
 return updateQuestionnairedData
}

const forgotPassword = async(body:UserDocument)=>{
  const {email} = body
  const userData = await User.findOne({email:email})
  const token = await Token.findOne({user:userData?._id})
  console.log(userData, "userData...........")
  if(!userData){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    )
  }
  await forgotPasswordEmail(email, token?.token)
}

const resetPassword = async(userId:ObjectId, newPassword:string)=>{
  // console.log(newPassword, 'newPasword.............')
   const hashedPassword = await bcrypt.hash(newPassword, 10)
   console.log(hashedPassword)
  const userData = await User.findOneAndUpdate({_id:userId},{$set:{password:hashedPassword}},{lean:true,new:true})
  return userData
}

const userInfo = async(userId:ObjectId, query:Dictionary)=>{
  const {page, limit} = query
  var hostedJamsFilter: Dictionary = {
  user:userId,
  isDeleted:false,
}

var attendedJamsFilter = {
  members: { $in: [userId] },  
  isDeleted: false           
};
  const [userInfo, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount] = await Promise.all([
    User.findById(userId).lean(),
    Jam.find(hostedJamsFilter, {}, paginationOptions(page, limit)),
    Jam.countDocuments(hostedJamsFilter),
    Jam.find(attendedJamsFilter, {},paginationOptions(page, limit)),
    Jam.countDocuments(attendedJamsFilter), 
  ])
  if(!userInfo){
   throw new OperationalError(
    STATUS_CODES.ACTION_FAILED,
    ERROR_MESSAGES.USER_NOT_FOUND
   )
  }
  return {userInfo, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount}
}

export { signup, verifyOtp, resendOtp, createProfile, login, changePassword, deleteAccount, logout, editProfile, editQuestionnaire, forgotPassword, resetPassword, userInfo};