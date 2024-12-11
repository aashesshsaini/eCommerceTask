import { Request, Response, NextFunction } from "express";
import { adminJamService } from "../../services";
import { successResponse } from "../../utils/response";
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";
import { ObjectId } from "mongoose";

const getJams = catchAsync(async (req: Request, res: Response) => {
  const timeZone: string = (req.headers.timezone as string) ?? "Asia/Kolkata";
  const { jams, jamsCount } = await adminJamService.getJams(
    req.query,
    timeZone
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { jams, jamsCount }
  );
});

const jamInfo = catchAsync(async (req: Request, res: Response) => {
  const jamData = await adminJamService.jamInfo(req.query);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    jamData
  );
});

const getReports = catchAsync(async (req: Request, res: Response) => {
  const reports = await adminJamService.getReports(req.query);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    reports
  );
});

const reportStatus = catchAsync(async (req: Request, res: Response) => {
  const reportData = await adminJamService.reportStatus(req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    reportData
  );
});

const reportPdf = catchAsync(async (req: Request, res: Response) => {
  const reportData = await adminJamService.reportPdf();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    reportData
  );
});

export default { getJams, jamInfo, getReports, reportStatus, reportPdf };
