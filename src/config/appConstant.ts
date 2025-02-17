import Joi from "joi";
import { objectId } from "../validations/custom.validation";

const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
  RESET_PASSWORD: "resetPassword",
};

const USER_TYPE = {
  ADMIN: "admin",
  USER: "user",
};

const DEVICE_TYPE = {
  IPHONE: "iPhone",
  ANDROID: "android",
  WEB: "web",
};

const STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const JOI = {
  EMAIL: Joi.string().email().lowercase().trim().required(),
  PASSWORD: Joi.string().min(8).required(),
  PHONENUMBER: Joi.string()
    .min(5)
    .max(15)
    .pattern(/^[0-9]+$/)
    .required(),
  OBJECTID: Joi.string().custom(objectId).required(),
  LIMIT: Joi.number().default(10000),
  PAGE: Joi.number().default(0),
  DEVICE_TYPE: Joi.string()
    .valid(...Object.values(DEVICE_TYPE))
    .required(),
  USER_TYPE: Joi.string().valid(USER_TYPE.USER, USER_TYPE.ADMIN).required(),
};

const SUCCESS_MESSAGES = {
  SUCCESS: "Success",
  LOGOUT: "User successfully logged out",
  DELETE: "user Delete successfully",
};

const ERROR_MESSAGES = {
  NOT_FOUND: "Not found",
  VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",
  SERVER_ERROR: "Something went wrong, Please try again.",
  AUTHENTICATION_FAILED: "Please authenticate",
  UNAUTHORIZED: "You are not authorized to perform this action",
  EMAIL_ALREADY_EXIST:
    "This email already exists. Please try with another email",
  MOBILE_ALREADY_EXIST:
    "This mobile number already exists. Please try with another mobile number",
  EMAIL_NOT_FOUND: "Email not found",
  ACCOUNT_NOT_EXIST: "Account does not exist",
  WRONG_PASSWORD: "Password is Incorrect",
  ACCOUNT_DELETED: "Your account has been deleted",
  ACCOUNT_BLOCKED: "Your account has been blocked by Admin",
  USER_NOT_FOUND: "User not found",
  FIELD_REQUIRED: "All the fields are required",
  PRODUCT_NOT_FOUND: "Product not  found"
};

const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACTION_PENDING: 202,
  ACTION_COMPLETE: 204,

  VALIDATION_FAILED: 400,
  ACTION_FAILED: 400,
  AUTH_FAILED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,

  ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed"
}

const CART_ACTION_CASE = {
  ADDTOCART: "addToCart",
  REMOVETOCART: "removeToCart"
}

export {
  TOKEN_TYPE,
  USER_TYPE,
  DEVICE_TYPE,
  JOI,
  STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  STATUS_CODES,
  ORDER_STATUS,
  CART_ACTION_CASE
};
