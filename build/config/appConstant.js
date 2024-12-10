"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVEL_DATA = exports.LEVEL = exports.GENRE = exports.COMMITMENT_LEVEL = exports.STATUS_CODES = exports.ERROR_MESSAGES = exports.SUCCESS_MESSAGES = exports.STATUS = exports.JOI = exports.DEVICE_TYPE = exports.USER_TYPE = exports.TOKEN_TYPE = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validations/custom.validation");
const TOKEN_TYPE = {
    ACCESS: "access",
    REFRESH: "refresh",
    RESET_PASSWORD: "resetPassword",
};
exports.TOKEN_TYPE = TOKEN_TYPE;
const USER_TYPE = {
    ADMIN: "admin",
    USER: "user",
};
exports.USER_TYPE = USER_TYPE;
const DEVICE_TYPE = {
    IPHONE: "iPhone",
    ANDROID: "android",
    WEB: "web",
};
exports.DEVICE_TYPE = DEVICE_TYPE;
const STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
};
exports.STATUS = STATUS;
const JOI = {
    EMAIL: joi_1.default.string().email().lowercase().trim().required(),
    PASSWORD: joi_1.default.string().min(8).required(),
    PHONENUMBER: joi_1.default.string()
        .min(5)
        .max(15)
        .pattern(/^[0-9]+$/)
        .required(),
    OBJECTID: joi_1.default.string().custom(custom_validation_1.objectId).required(),
    LIMIT: joi_1.default.number().default(10000),
    PAGE: joi_1.default.number().default(0),
    DEVICE_TYPE: joi_1.default.string()
        .valid(...Object.values(DEVICE_TYPE))
        .required(),
    USER_TYPE: joi_1.default.string().valid(USER_TYPE.USER, USER_TYPE.ADMIN).required(),
    ADDRESS: joi_1.default.object().keys({
        address: joi_1.default.string(),
        city: joi_1.default.string(),
        country: joi_1.default.string(),
        postalCode: joi_1.default.number(),
        // longitude: Joi.number().required(),
        // latitude: Joi.number().required(),
    }),
};
exports.JOI = JOI;
const SUCCESS_MESSAGES = {
    SUCCESS: "Success",
    LOGOUT: "User successfully logged out",
    DELETE: "user Delete successfully",
    VERIFIED: "user verified successfully",
};
exports.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
const ERROR_MESSAGES = {
    NOT_FOUND: "Not found",
    VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",
    SERVER_ERROR: "Something went wrong, Please try again.",
    AUTHENTICATION_FAILED: "Please authenticate",
    UNAUTHORIZED: "You are not authorized to perform this action",
    EMAIL_ALREADY_EXIST: "This email already exists. Please try with another email",
    MOBILE_ALREADY_EXIST: "This mobile number already exists. Please try with another mobile number",
    EMAIL_NOT_FOUND: "Email not found",
    BLOG_NOT_FOUND: "Blog not found",
    SERVICE_NOT_FOUND: "Service not found",
    SERVICE_QUESTION_NOT_FOUND: "This service question not found",
    ACCOUNT_NOT_EXIST: "Account does not exist",
    WRONG_PASSWORD: "Password is Incorrect",
    ACCOUNT_DELETED: "Your account has been deleted",
    ACCOUNT_BLOCKED: "Your account has been blocked by Admin",
    USER_NOT_FOUND: "User not found",
    FIELD_REQUIRED: "All the fields are required",
    ALREADY_DONE: "you have already sent the data for approval",
    JAM_NOT_FOUND: "Jam not found",
};
exports.ERROR_MESSAGES = ERROR_MESSAGES;
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
exports.STATUS_CODES = STATUS_CODES;
const COMMITMENT_LEVEL = {
    FOCUSED: "Focused, serious practice",
    JOYFUL_GROUP: "Joyful group music session",
    SOMETIMES: "Sometimes one, sometimes the other",
};
exports.COMMITMENT_LEVEL = COMMITMENT_LEVEL;
const GENRE = {
    JAZZ: "Jazz",
    ROCK: "Rock",
    BLUES: "Blues",
    CLASSIC: "Classic",
};
exports.GENRE = GENRE;
const LEVEL = {
    NOVOICE: "Novice",
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCE: "Advanced",
    PRO: "Pro",
};
exports.LEVEL = LEVEL;
const LEVEL_DATA = {
    proficient: [
        "I am just starting and struggle to produce consistent sound.",
        "I can produce sound but often have issues with tone quality and control.",
        "I can produce good sound most of the time but still have occasional difficulties.",
        "I consistently produce high-quality sound and have good control over my instrument",
        "I am a pro and can produce exceptional sound with precision and ease in any context.",
    ],
    improvisationalSkill: [
        "I cannot improvise; I need to prepare the part in advance",
        "I have basic improvisation skills, e.g., I can follow simple chord progressions but struggle with more complex changes",
        "I can improvise moderately well, incorporating some stylistic elements, but I'm still refining my technique and creativity",
        "I have fluent improvisation skills and am able to create meaningful phrases",
        "I am highly skilled at improvisation and can create innovative and sophisticated solos effortlessly",
    ],
    aboutRepertoire: [
        "I need to study a tune in advance of the session.",
        "I know a few tunes (say, around 20) that I can play without prior preparation”",
        "I know a good range of tunes (say, around 40) that I can play without prior preparation (cannot sight read)",
        "I know many tunes (say, around 80) that I don’t need to study in advance and can sight read simple ones I never played before",
        "I can confidently play most tunes that would be called in a public jam and can sight read fluently when necessary",
    ],
    publicExpirence: [
        "I have no performance experience.",
        "I have limited experience, having performed on stage in minor roles or as part of an ensemble.",
        "I have occasionally performed on stage in a lead role.",
        "I have regular experience performing on stage in local events and am comfortable in prominent roles.",
        "I have extensive experience performing on stage in national events and frequently take on leading roles with confidence.",
    ],
    motivation: [
        "I care about practicing and improving, but most of all I want to enjoy the experience of making music with other musicians",
        "I am dedicated to improving my musicianship. Collaborating with other musicians is the best way to grow and develop my skills.",
        "A little bit of both; Sometimes I seek the joy of making music, sometimes the challenge of a committed practice session.",
    ],
};
exports.LEVEL_DATA = LEVEL_DATA;
