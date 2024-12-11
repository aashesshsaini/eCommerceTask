import Joi from "joi";
import { JOI, GENRE, REPORT_TYPE } from "../../config/appConstant";

const getJams = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    search: Joi.string().allow("", null),
    filter: Joi.string().valid("past", "onGoing", "upComing"),
  }),
};

const jamInfo = {
  query: Joi.object().keys({
    jamId: JOI.OBJECTID,
  }),
};

const getReports = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    reportType: Joi.string().valid(...Object.values(REPORT_TYPE)),
  }),
};

const reportStatus = {
  body: Joi.object().keys({
    reportId: JOI.OBJECTID,
  }),
};

const reportPdf = {
  query: Joi.object().keys({}),
};

export default { getJams, jamInfo, getReports, reportStatus, reportPdf };
