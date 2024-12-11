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
exports.reportPdf = exports.reportStatus = exports.getReports = exports.jamInfo = exports.getJams = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const models_2 = require("../../models");
const getJams = (query, timeZone) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, filter } = query;
    var queryFilter = { isDeleted: false };
    switch (filter) {
        case "past":
    }
    const [jams, jamsCount] = yield Promise.all([
        models_1.Jam.find(queryFilter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(queryFilter),
    ]);
    console.log(jams, jamsCount, "jams, jamsCount...........");
    return { jams, jamsCount };
});
exports.getJams = getJams;
const jamInfo = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { jamId } = query;
    const jamData = yield models_1.Jam.findOne({ _id: jamId, isDeleted: false })
        .populate("members")
        .lean();
    if (!jamData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.JAM_NOT_FOUND);
    }
    return jamData;
});
exports.jamInfo = jamInfo;
const getReports = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, reportType } = query;
    let filter = { isDeleted: false };
    if (reportType) {
        filter = Object.assign(Object.assign({}, filter), { reportType });
    }
    const [reportListing, reportCount] = yield Promise.all([
        models_2.Report.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_2.Report.countDocuments(filter),
    ]);
    return { reportListing, reportCount };
});
exports.getReports = getReports;
const reportStatus = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = body;
    const reportUpdatedData = yield models_2.Report.findOneAndUpdate({ _id: reportId, isDeleted: false, status: false }, { $set: { status: true } }, { new: true });
    if (!reportUpdatedData) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Report not found");
    }
    return reportUpdatedData;
});
exports.reportStatus = reportStatus;
const reportPdf = () => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield models_2.Report.find({ isDeleted: false });
    if (reports.length === 0) {
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Reports not found");
    }
    return reports;
});
exports.reportPdf = reportPdf;
