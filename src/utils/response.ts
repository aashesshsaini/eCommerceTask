import { Request, Response } from 'express';
import {
    STATUS_CODES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
} from '../config/appConstant';
import logger from '../config/logger';
import {
    ValidationError,
    OperationalError,
    NotFoundError,
    AuthFailedError,
} from './error';

const successResponse = (
    req: Request,
    res: Response,
    statusCode: number = STATUS_CODES.SUCCESS,
    message: string = SUCCESS_MESSAGES.SUCCESS,
    data?: any
) => {
    const result = {
        statusCode,
        message: res.__(message), // Added Localization to response
        data,
    };
    return res.status(statusCode).json(result);
};

const errorResponse = (error: any, req: Request, res: Response) => {
    let statusCode =
        error.code ||
        error.statusCode ||
        error.response?.status ||
        STATUS_CODES.ERROR;

    const logError = error.logError ?? true;

    if (statusCode === STATUS_CODES.ERROR) {
        Error.captureStackTrace(error, error.constructor);
    }

    // if (statusCode === STATUS_CODES.ERROR) {
    //     return res.status(statusCode).json({
    //         statusCode,
    //         message: res.__(ERROR_MESSAGES),
    //     });
    // }

    const message =
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof OperationalError ||
        error instanceof AuthFailedError
            ? res.__(error.message)
            : error.toString();

    return res.status(statusCode || STATUS_CODES.ERROR).json({
        statusCode: statusCode || STATUS_CODES.ERROR,
        message,
        data: error.data,
    });
};

export { successResponse, errorResponse };
