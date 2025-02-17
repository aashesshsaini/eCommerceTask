import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Document, Schema, Types } from "mongoose";
import { ObjectId } from 'mongodb';
import { OperationalError } from '../utils/error';
import config from '../config/config';
import { TOKEN_TYPE, USER_TYPE, STATUS_CODES, ERROR_MESSAGES } from '../config/appConstant';
import { Token } from '../models';
import { JwtPayload } from '../types';
import { TokenDocument } from '../interfaces/token.interface';
import { UserDocument } from '../interfaces/user.interface';
import { AdminDocument } from '../interfaces/admin.interface';

interface Data {
  user?: UserDocument | AdminDocument
  tokenExpires: moment.Moment;
  tokenType: string;
  tokenId: ObjectId;
  deviceToken: string;
  deviceType: string;
  deviceId: string;
  userType: string;
  accessToken?: string,
  otp?: { code: string, expiresAt: string }
}

interface TokenDataToBeSaved {
  expires: Date;
  type: string;
  _id: ObjectId;
  device: { type: string; token: string };
  role: string;
  token: string | undefined;
  admin: ObjectId;
  user: ObjectId;
}


const generateToken = (data: Data, secret: string = config.jwt.secret): string => {
  const payload = {
    exp: data.tokenExpires.unix(),
    type: data.tokenType,
    id: data.tokenId,
    role: data.userType,
  };

  return jwt.sign(payload, secret) as string;
};

const saveToken = async (data: Data) => {
  const dataToBeSaved: Partial<TokenDocument> = {
    expires: data.tokenExpires.toDate(),
    type: data.tokenType,
    _id: data.tokenId,
    device: { type: data.deviceType, token: data.deviceToken, id: data.deviceId },
    role: data.userType,
    token: data?.accessToken,
    otp: data.otp
  };

  if (data.userType === USER_TYPE.ADMIN) {
    dataToBeSaved.admin = (data.user as AdminDocument)?._id as Schema.Types.ObjectId;
  } else {
    data.userType === USER_TYPE.USER;
    dataToBeSaved.user = (data.user as UserDocument)?._id as Schema.Types.ObjectId;;
  }

  const tokenDoc = await Token.create(dataToBeSaved);
  console.log(tokenDoc, "tokenDoc.....")
  return tokenDoc;
};

const generateAuthToken = async (
  userType: string,
  user: UserDocument | AdminDocument,
  deviceToken: string,
  deviceType: string,
  deviceId: string,
  otp?: { code: string, expiresAt: string }
): Promise<{ token: string; expires: Date }> => {
  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'days');
  const tokenId = new ObjectId();
  const accessToken: string = generateToken({
    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
    deviceToken,
    deviceType,
    deviceId
    // user
  });
  await saveToken({
    accessToken,
    tokenExpires,
    tokenId,
    deviceToken,
    deviceType,
    deviceId,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    user,
    otp
  });
  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};


const verifyEmailToken = async (token: string) => {
  console.log(token);
  const payload = jwt.verify(token, config?.jwt?.secret) as JwtPayload;
  try {
    if (payload) {
      const tokenData = await Token.findOne({ _id: payload?.id, isDeleted: false });
      return tokenData || null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyResetPasswordToken = async (token: string) => {
  try {
    const payload: JwtPayload = jwt.verify(token, config.jwt.secret) as JwtPayload;

    console.log(payload, 'payload............')

    const tokenData = await Token.findOne({
      _id: payload?.id,
      isDeleted: false,
      // expires: { $gte: new Date() },
    }).populate('user');
    console.log(tokenData, "tokenData")
    return tokenData;
  } catch (error) {
    throw error;
  }

}

export { generateAuthToken, verifyEmailToken, verifyResetPasswordToken };
