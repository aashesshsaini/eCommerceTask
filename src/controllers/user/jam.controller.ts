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
    const timeZone: string = (req.headers.timezone as string) ?? "Asia/Kolkata";
      const {jams, jamsCount, nearByJams, nearByJamsCount, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount} = await userJamService.jamGet(req.query, req.token.user._id, timeZone);  
      return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        {jams, jamsCount, nearByJams, nearByJamsCount, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount}
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

    const jamInfo = catchAsync(async (req: Request, res: Response) => {
    const jamdData = await userJamService.jamInfo(req.query, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      jamdData
    );
  });

  const cancelJam = catchAsync(async (req: Request, res: Response) => {
    const jamUpdatedData = await userJamService.cancelJam(req.body, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      jamUpdatedData
    );
  });

   const getUsers = catchAsync(async (req: Request, res: Response) => {
    const{Users, countUser} = await userJamService.getUsers(req.query, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
    {Users, countUser}
    );
  });


   const favMember = catchAsync(async (req: Request, res: Response) => {
    const message =await userJamService.favMember(req.body, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
    message 
  );
  });

     const favMemberGet = catchAsync(async (req: Request, res: Response) => {
    const {favMemList, favMemCount} =await userJamService.favMemberGet(req.query, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
    {favMemList, favMemCount} 
  );
  });

  const inviteMembers = catchAsync(async (req: Request, res: Response) => {
    const members =await userJamService.inviteMembers(req.body, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      members 
  );
  });

    const acceptJam = catchAsync(async (req: Request, res: Response) => {
    const members =await userJamService.acceptJam(req.body, req.token.user._id);  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      members 
  );
  });


  export default {jamCreate, jamGet, jamUpdate, jamDelete, jamInfo, cancelJam, getUsers, favMember, favMemberGet, inviteMembers, acceptJam}