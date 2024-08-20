"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFailedError = exports.NotFoundError = exports.OperationalError = exports.ValidationError = void 0;
const appConstant_1 = require("../config/appConstant");
class ValidationError extends Error {
    constructor(message = '', logError = true, statusCode = appConstant_1.STATUS_CODES.VALIDATION_FAILED) {
        super(message);
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.name = this.constructor.name;
        this.message = message;
        this.logError = logError;
        this.statusCode = statusCode;
    }
}
exports.ValidationError = ValidationError;
class OperationalError extends Error {
    constructor(statusCode = appConstant_1.STATUS_CODES.ACTION_FAILED, message = appConstant_1.ERROR_MESSAGES.SERVER_ERROR, data = null, logError = true) {
        super(message);
        Object.setPrototypeOf(this, OperationalError.prototype);
        this.name = '';
        this.data = data;
        this.statusCode = statusCode;
        this.logError = logError;
    }
}
exports.OperationalError = OperationalError;
class NotFoundError extends Error {
    constructor(statusCode = appConstant_1.STATUS_CODES.NOT_FOUND, message = appConstant_1.ERROR_MESSAGES.NOT_FOUND, logError = true) {
        super(message);
        this.statusCode = statusCode;
        this.logError = logError;
    }
}
exports.NotFoundError = NotFoundError;
class AuthFailedError extends Error {
    constructor(message = appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, statusCode = appConstant_1.STATUS_CODES.AUTH_FAILED) {
        super(message);
        Object.setPrototypeOf(this, AuthFailedError.prototype);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.logError = statusCode === appConstant_1.STATUS_CODES.FORBIDDEN;
    }
}
exports.AuthFailedError = AuthFailedError;
