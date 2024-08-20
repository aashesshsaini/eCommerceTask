"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const appConstant_1 = require("../config/appConstant");
const error_1 = require("./error");
const successResponse = (req, res, statusCode = appConstant_1.STATUS_CODES.SUCCESS, message = appConstant_1.SUCCESS_MESSAGES.SUCCESS, data) => {
    const result = {
        statusCode,
        message: res.__(message), // Added Localization to response
        data,
    };
    return res.status(statusCode).json(result);
};
exports.successResponse = successResponse;
const errorResponse = (error, req, res) => {
    var _a, _b;
    let statusCode = error.code ||
        error.statusCode ||
        ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) ||
        appConstant_1.STATUS_CODES.ERROR;
    const logError = (_b = error.logError) !== null && _b !== void 0 ? _b : true;
    if (statusCode === appConstant_1.STATUS_CODES.ERROR) {
        Error.captureStackTrace(error, error.constructor);
    }
    // if (statusCode === STATUS_CODES.ERROR) {
    //     return res.status(statusCode).json({
    //         statusCode,
    //         message: res.__(ERROR_MESSAGES),
    //     });
    // }
    const message = error instanceof error_1.NotFoundError ||
        error instanceof error_1.ValidationError ||
        error instanceof error_1.OperationalError ||
        error instanceof error_1.AuthFailedError
        ? res.__(error.message)
        : error.toString();
    return res.status(statusCode || appConstant_1.STATUS_CODES.ERROR).json({
        statusCode: statusCode || appConstant_1.STATUS_CODES.ERROR,
        message,
        data: error.data,
    });
};
exports.errorResponse = errorResponse;
