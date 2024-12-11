import { Report } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { ObjectId } from "mongoose";

const contactUs = async (body: Dictionary) => {
  const { email, message } = body;
  //  contactUsEmail(email, message)
};

const report = async (body: Dictionary, userId: ObjectId) => {
  const { reportedTo, reportType } = body;
  const existingReportData = await Report.findOne({
    reportedBy: userId,
    reportedTo,
    reportType,
  });
  console.log(existingReportData, "existingReportData.........");
  if (existingReportData) {
    throw new OperationalError(STATUS_CODES.ACTION_FAILED, "Already reported");
  }
  const reportData = await Report.create({
    reportedBy: userId,
    reportedTo,
    reportType,
  });
  console.log(reportData, "reportData...............");
  return reportData;
};

export { contactUs, report };
