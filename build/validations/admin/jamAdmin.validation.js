"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const getJams = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow("", null),
        filter: joi_1.default.string().valid("past", "onGoing", "upComing"),
    }),
};
const jamInfo = {
    query: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
    }),
};
const getReports = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        reportType: joi_1.default.string().valid(...Object.values(appConstant_1.REPORT_TYPE)),
    }),
};
const reportStatus = {
    body: joi_1.default.object().keys({
        reportId: appConstant_1.JOI.OBJECTID,
    }),
};
const reportPdf = {
    query: joi_1.default.object().keys({}),
};
exports.default = { getJams, jamInfo, getReports, reportStatus, reportPdf };
