import rateLimit from "express-rate-limit"
import {NotFoundError} from "../utils/error"
import {errorResponse} from "../utils/response"
import { ERROR_MESSAGES, STATUS_CODES } from "../config/appConstant"
import path from 'path'
import { Request, Response, NextFunction } from 'express';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
  });
  
  const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return errorResponse(error, req, res);
  };
  
  const routeNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    return errorResponse(
      new NotFoundError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND),
      req,
      res
    );
  };

  export {authLimiter, errorHandler, routeNotFoundHandler}

