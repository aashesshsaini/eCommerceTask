import { Request, Response, NextFunction} from 'express';
import { adminJamService} from '../../services';
import { successResponse } from '../../utils/response';
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from '../../config/appConstant';
import { catchAsync } from '../../utils/universalFunctions';

   const getJams = catchAsync(async (req: Request, res: Response) => {
    const timeZone: string = (req.headers.timezone as string) ?? "Asia/Kolkata";
      const {jams, jamsCount} = await adminJamService.getJams(req.query, timeZone);  
      return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        {jams, jamsCount}
      );
    });

    export default {getJams}