import { Request, Response, NextFunction} from 'express';
import { userAuthService, tokenService } from '../../services';
import { successResponse } from '../../utils/response';
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from '../../config/appConstant';
import { catchAsync } from '../../utils/universalFunctions';
import {formatUser} from "../../utils/formatResponse";
import { TokenDocument, UserDocument } from '../../interfaces';
import { ObjectId } from 'mongoose';
import sendOtp from "../../libs/sendOtp"
import { optional } from 'joi';


const signup = catchAsync(async (req: Request, res: Response) => {
    const user = await userAuthService.signup(req.body);
      //  const otp = await sendOtp(req.body.phoneNumber as string, req.body.countryCode as string)
  const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };
    const deviceToken = req.body.deviceToken as string ;
    const deviceType = req.body.deviceType as string ;
    const accessToken = await tokenService.generateAuthToken(
      USER_TYPE.USER,
      user,
      deviceToken,
      deviceType,
      otp
    );
  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      {
        tokenData: accessToken,
        user,
      }
    );
  });

  const verifyOtp = catchAsync(async (req: Request, res: Response) => {
 await userAuthService.verifyOtp(req.body.code, req.token._id);

    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.VERIFIED,
    );
  });

  const resendOtp = catchAsync(async (req: Request, res: Response) => {
    await userAuthService.resendOtp(req.token?.user);
   
       return successResponse(
         req,
         res,
         STATUS_CODES.SUCCESS,
         SUCCESS_MESSAGES.SUCCESS,
       );
     });

     const createProfile = catchAsync(async (req: Request, res: Response) => {
      const userData = await userAuthService.createProfile(req.body, req.token.user._id);
      formatUser(userData)
      return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        userData
      );
    });

  const login = catchAsync(async (req: Request, res: Response) => {
    const userData = await userAuthService.login(req.body);
    const deviceToken = req.body.deviceToken as string ;
    const deviceType = req.body.deviceType as string ;
    const accessToken = await tokenService.generateAuthToken(
      USER_TYPE.USER,
      userData,
      deviceToken,
      deviceType
    );
  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      {
        tokenData: accessToken,
        userData,
      }
    );
  });

  const changePassword = catchAsync(async (req: Request, res: Response) => {
    const updatedUser = await userAuthService.changePassword(req.body, req?.token);
  
    return successResponse(
      req,
      res, 
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
    );
  });

  const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    await userAuthService.deleteAccount(req?.token?.user);
 
   return successResponse(
     req,
     res,
     STATUS_CODES.SUCCESS,
     SUCCESS_MESSAGES.DELETE,
   );
 });

  const logout = catchAsync(async (req: Request, res: Response) => {
     await userAuthService.logout(req?.token?.user);
  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.LOGOUT,
    );
  });

  const editProfile = catchAsync(async (req: Request, res: Response) => {
    const updatedProfileData = await userAuthService.editProfile(req?.token?.user?._id, req?.body);
  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      updatedProfileData
    );
  });

  const editQuestionnaire = catchAsync(async (req: Request, res: Response) => {
    const updateQuestionnairedData = await userAuthService.editQuestionnaire(req?.token?.user?._id, req?.body);
  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      updateQuestionnairedData
    );
  });

  const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const updatedProfileData = await userAuthService.forgotPassword(req?.body);
  
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      updatedProfileData
    );
  });

  const forgotPage = catchAsync(async (req, res) => {
    try {
      console.log(req?.query?.token, "req.query.token");
      const token = req.query.token;

      if (typeof token !== 'string') {
        return res.render("commonMessage", {
          title: "Forgot Password",
          errorMessage: "Invalid token",
          // projectName: config.projectName,
        });
      }
      const tokenData = await tokenService.verifyResetPasswordToken(token);
      if (tokenData) {
        return res.render("./forgotPassword/forgotPassword", {
          title: "Forgot Password",
          token: req.query.token,
          // projectName: config.projectName,
        });
      }
      return res.render("commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has been expired",
        // projectName: config.projectName,
      });
    } catch (error) {
      res.render("commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has been expired",
        // projectName: config.projectName,
      });
    }
  });

  const resetForgotPassword = catchAsync(async (req, res) => {
    try {
      const token = req?.query?.token;
      if (typeof token !== 'string') {
        return res.render("commonMessage", {
          title: "Forgot Password",
          errorMessage: "Invalid token",
          // projectName: config.projectName,
        });
      }
      const tokenData = await tokenService.verifyResetPasswordToken(token);
      // console.log(tokenData, "tokenData.............");
      if (!tokenData)
        return res.render("commonMessage", {
          title: "Forgot Password",
          errorMessage: "Sorry, this link has been expiredsss",
          // projectName: config.projectName,
        });
        console.log(tokenData, "tokenData,,,,,,,,,,,,,,,,,,,,,")
      const data = await userAuthService.resetPassword(
        tokenData?.user,
        req?.body?.newPassword
      );
      console.log(data, "userData..........");
      return res.render("commonMessage", {
        title: "Forgot Password",
        successMessage: "Your password is successfully changed",
        // projectName: config.projectName,
      });
    } catch (error) {
      res.render("commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has been expiredxxx",
        // projectName: config.projectName,
      });
    }
  });
  

  export default { signup, verifyOtp, resendOtp, createProfile, login, changePassword, deleteAccount, logout, editProfile, editQuestionnaire, forgotPassword, forgotPage, resetForgotPassword};