import { Request, Response, NextFunction } from "express";
import { socketService } from "../../services";
import { successResponse } from "../../utils/response";
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";

const notificationListing = catchAsync(async (req: Request, res: Response) => {
  const notification = await socketService.notificationListing(
    req.query,
    req.token
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    notification
  );
});

const getChats = catchAsync(async (req: Request, res: Response) => {
  const chats = await socketService.getChats(req.query);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    chats
  );
});

export default { getChats, notificationListing };
