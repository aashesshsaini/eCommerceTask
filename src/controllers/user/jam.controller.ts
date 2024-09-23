import { Request, Response, NextFunction} from 'express';
import { userJamService} from '../../services';
import { successResponse } from '../../utils/response';
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from '../../config/appConstant';
import { catchAsync } from '../../utils/universalFunctions';


const jamCreate = catchAsync(async (req: Request, res: Response) => {
    const jamData = await userJamService.jamCreate(req.body, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      jamData
    );
  });

  const jamGet = catchAsync(async (req: Request, res: Response) => {
   const timeZone: string = (req.headers.timezone as string) ?? "Europe/Athens";
    const {jams, jamsCount} = await userJamService.jamGet(req.query, req.token.user._id, timeZone);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      {jams, jamsCount}
    );
  });

   const jamUpdate = catchAsync(async (req: Request, res: Response) => {
    const jamUpdatedData = await userJamService.jamUpdate(req.body, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      jamUpdatedData
    );
  });

  const jamDelete = catchAsync(async (req: Request, res: Response) => {
     await userJamService.jamDelete(req.query, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
     "Jam delete successfully"
    );
  });

  export default {jamCreate, jamGet, jamUpdate, jamDelete}