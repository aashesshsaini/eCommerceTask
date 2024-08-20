import { Request, Response, NextFunction} from 'express';
import { ObjectId } from 'mongoose';
import { userManageService} from '../../services';
import { successResponse } from '../../utils/response';
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from '../../config/appConstant';
import { catchAsync } from '../../utils/universalFunctions';
import { TokenDocument, AdminDocument } from '../../interfaces';
import { Dictionary } from '../../types';

const addUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userManageService.addUser(req.body);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
     user
    );
  });

  const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userManageService.deleteUser(req.query);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
     user
    );
  });

  const userInfo = catchAsync(async (req: Request, res: Response) => {
    const userInfo = await userManageService.userInfo(req.query);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      userInfo
    );
  });

  const getUsers = catchAsync(async (req: Request, res: Response) => {
    const {Users, countUser} = await userManageService.getUsers(req.query);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      {Users, countUser}
    );
  });

  const userBlock = catchAsync(async (req: Request, res: Response) => {
    const userBlockedData  = await userManageService.userBlock(req.body);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      userBlockedData
    );
  });

  const dashboard = catchAsync(async (req: Request, res: Response) => {
    const {countUser}  = await userManageService.dashboard();
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      {countUser}
    );
  });

  export default {addUser, deleteUser, userInfo, getUsers,userBlock, dashboard}