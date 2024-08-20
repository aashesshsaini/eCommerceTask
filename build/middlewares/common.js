"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFoundHandler = exports.errorHandler = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const appConstant_1 = require("../config/appConstant");
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
});
exports.authLimiter = authLimiter;
const errorHandler = (error, req, res, next) => {
    return (0, response_1.errorResponse)(error, req, res);
};
exports.errorHandler = errorHandler;
const routeNotFoundHandler = (req, res, next) => {
    return (0, response_1.errorResponse)(new error_1.NotFoundError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.NOT_FOUND), req, res);
};
exports.routeNotFoundHandler = routeNotFoundHandler;
