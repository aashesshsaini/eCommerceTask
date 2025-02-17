import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { adminAuthService, tokenService } from '../../services';
import { successResponse } from '../../utils/response';
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from '../../config/appConstant';
import { catchAsync } from '../../utils/universalFunctions';
import { TokenDocument, AdminDocument } from '../../interfaces';
import { formatSignUpUser } from '../../utils/formatResponse';

const login = catchAsync(async (req: Request, res: Response) => {
  const admin: AdminDocument = await adminAuthService.login(req.body);
  const deviceToken = req.body.deviceToken as string;
  const deviceType = req.body.deviceType as string;
  const deviceId = req.body.deviceId as string;
  const accessToken = await tokenService.generateAuthToken(
    USER_TYPE.ADMIN,
    admin,
    deviceToken,
    deviceType,
    deviceId
  );
  const formatAdminData = formatSignUpUser(admin);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {
      tokenData: accessToken,
      admin: formatAdminData,
    }
  );
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const token: string | undefined = req.token;
  const logoutData = await adminAuthService.logout(token);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT,
  );
});


const changePassword = catchAsync(async (req: Request, res: Response) => {
  await adminAuthService.changePassword(req.token?.admin, req.body);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
  );
});

export default { login, logout, changePassword };
