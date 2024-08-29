import { Request, Response, NextFunction} from 'express';
import { successResponse } from '../../utils/response';
import { userCommonService } from '../../services';
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from '../../config/appConstant';
import { catchAsync } from '../../utils/universalFunctions';
import { TokenDocument, UserDocument } from '../../interfaces';

const contactUs = catchAsync(async (req: Request, res: Response) => {
    await userCommonService.contactUs(req.body);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
    );
  });

  export default {contactUs}