import bcrypt from "bcryptjs";
import { Admin, Token, User } from "../../models";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
} from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import Stripe from "stripe"
import config from "../../config/config";
import { Dictionary } from "../../types";
import { TokenDocument, UserDocument } from "../../interfaces";
import { forgotPasswordEmail } from "../../libs/sendMails";
import { ObjectId } from "mongoose";
const stripeInstance = new Stripe(config.stripeSecretKey);


const signup = async (body: UserDocument) => {
  const { firstName, lastName, email, password, mobileNumber, countryCode } =
    body;
  try {
    const [existinguserByEmail, existinguserByMobileNumber] = await Promise.all([
      User.findOne({ email: email, isDeleted: false }),
      User.findOne({
        mobileNumber: mobileNumber,
        isDeleted: false,
      }),
    ]);

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
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      countryCode,
    });

    const stripeCustomer = await stripeInstance.customers.create({
      name: firstName,
      email,
      phone: `${countryCode}${mobileNumber}`,
    });

    user.stripeCustomerId = stripeCustomer.id;
    await user.save();
    return user;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};


const login = async (body: Dictionary) => {
  const { email, password, mobileNumber } = body;
  console.log(body, "body............");
  try {
    if (email) {
      var user = await User.findOne({ email: email, isDeleted: false });
    } else {
      var user = await User.findOne({ mobileNumber, isDeleted: false });
    }

    console.log(user);
    if (!user) {
      throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
    if (user.isBlocked) {
      throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ACCOUNT_BLOCKED
      );
    }
    console.log(user, "user.........");
    if (user.isDeleted) {
      throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ACCOUNT_DELETED
      );
    }
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      );
    }
    const userData = await User.findOne({ email }) as UserDocument
    return userData;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const changePassword = async (
  body: Dictionary,
  token: TokenDocument
) => {
  const { newPassword, oldPassword } = body;
  try {
    const user = await User.findById(token?.user);
    if (!user) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      );
    }
    const userNewPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = { password: userNewPassword };
    Object.assign(user, updatePassword);
    await user.save();
    return user;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const deleteAccount = async (user: Dictionary, query: Dictionary) => {
  const { password } = query;
  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      );
    }

    const [deletedUser, deletedToken] = await Promise.all([
      User.findByIdAndUpdate(
        user._id,
        { isDeleted: true, isVerified: false },
        { lean: true, new: true }
      ),
      Token.updateMany(
        { user: user._id },
        { isDeleted: false },
        { lean: true, new: true }
      ),
    ]);
    if (!deletedUser) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }

};

const logout = async (userId: ObjectId) => {
  await Token.updateMany({ user: userId }, { isDeleted: false });
};

const editProfile = async (user: ObjectId, body: UserDocument) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    countryCode,
  } = body;
  try {
    const updatedProfileData = await User.findByIdAndUpdate(
      user,
      {
        firstName,
        lastName,
        email,
        mobileNumber,
        countryCode,
      },
      { lean: true, new: true }
    );
    if (!updatedProfileData) {
      throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
    return updatedProfileData;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};


const forgotPassword = async (body: UserDocument) => {
  const { email } = body;
  try {
    const userData = await User.findOne({ email: email });
    const token = await Token.findOne({ user: userData?._id }) as TokenDocument;
    console.log(userData, "userData...........");
    if (!userData) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
    await forgotPasswordEmail(email, token.token, userData.firstName);
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const resetPassword = async (userId: ObjectId, newPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);
    const userData = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { lean: true, new: true }
    );
    return userData;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const userInfo = async (user: Dictionary, query: Dictionary) => {
  return user
};

export {
  signup,
  login,
  changePassword,
  deleteAccount,
  logout,
  editProfile,
  forgotPassword,
  resetPassword,
  userInfo,
};
