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

interface conactUsBody{
    email:string,
    message:string
}

const contactUs = async(body:conactUsBody)=>{
 const {email, message} = body
//  contactUsEmail(email, message)
}

export {contactUs}