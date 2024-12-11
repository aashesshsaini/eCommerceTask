"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.contactUs = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const contactUs = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, message } = body;
    //  contactUsEmail(email, message)
});
exports.contactUs = contactUs;
const report = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportedTo, reportType } = body;
    const existingReportData = yield models_1.Report.findOne({
        reportedBy: userId,
        reportedTo,
        reportType,
    });
    console.log(existingReportData, "existingReportData.........");
    if (existingReportData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Already reported");
    }
    const reportData = yield models_1.Report.create({
        reportedBy: userId,
        reportedTo,
        reportType,
    });
    console.log(reportData, "reportData...............");
    return reportData;
});
exports.report = report;
