import { Jam, Token, User } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";
import { Report } from "../../models";

const getJams = async (query: Dictionary, timeZone?: string) => {
  const { page, limit, filter } = query;
  var queryFilter = { isDeleted: false };
  switch (filter) {
    case "past":
  }
  const [jams, jamsCount] = await Promise.all([
    Jam.find(queryFilter, {}, paginationOptions(page, limit)),
    Jam.countDocuments(queryFilter),
  ]);

  console.log(jams, jamsCount, "jams, jamsCount...........");

  return { jams, jamsCount };
};

const jamInfo = async (query: Dictionary) => {
  const { jamId } = query;
  const jamData = await Jam.findOne({ _id: jamId, isDeleted: false })
    .populate("members")
    .lean();
  if (!jamData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    );
  }
  return jamData;
};

const getReports = async (query: Dictionary) => {
  const { page, limit, reportType } = query;
  let filter: Dictionary = { isDeleted: false };
  if (reportType) {
    filter = {
      ...filter,
      reportType,
    };
  }
  const [reportListing, reportCount] = await Promise.all([
    Report.find(filter, {}, paginationOptions(page, limit)),
    Report.countDocuments(filter),
  ]);
  return { reportListing, reportCount };
};

const reportStatus = async (body: Dictionary) => {
  const { reportId } = body;
  const reportUpdatedData = await Report.findOneAndUpdate(
    { _id: reportId, isDeleted: false, status: false },
    { $set: { status: true } },
    { new: true }
  );
  if (!reportUpdatedData) {
    throw new OperationalError(STATUS_CODES.ACTION_FAILED, "Report not found");
  }
  return reportUpdatedData;
};

const reportPdf = async () => {
  const reports = await Report.find({ isDeleted: false });
  if (reports.length === 0) {
    throw new OperationalError(STATUS_CODES.ACTION_FAILED, "Reports not found");
  }
  return reports;
};

export { getJams, jamInfo, getReports, reportStatus, reportPdf };
