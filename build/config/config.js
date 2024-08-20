"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = joi_1.default.object({
    PORT: joi_1.default.number().required(),
    MONGODB_URL: joi_1.default.string().required().description("Mongo DB url"),
    JWT_SECRET: joi_1.default.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number()
        .default(30)
        .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number()
        .default(30)
        .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which verify email token expires"),
    EMAIL: joi_1.default.string().description("username for email server"),
    PASSWORD: joi_1.default.string().description("password for email server"),
    API_BASE_URL: joi_1.default.string().required().description("Api base url"),
    ADMIN_BASE_URL: joi_1.default.string().description("Admin pannel base url"),
    ACCOUNT_SID: joi_1.default.string().description("account sid for twillio"),
    ACCOUNT_SECRET: joi_1.default.string().description('secret key for twillio'),
    PHONE_NUMBER: joi_1.default.string().description("phon enumber for twilio"),
    // SERVER_BASE_URL: Joi.string().description("Server pannel base url"),
    ENVIRONMENT: joi_1.default.string().valid("development", "production").required()
}).unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error}`);
}
const config = {
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    smtp: { email: envVars.EMAIL, password: envVars.PASSWORD },
    twilio: { accountSID: envVars.ACCOUNT_SID, accountSecret: envVars.ACCOUNT_SECRET, phoneNumber: envVars.PHONE_NUMBER },
    baseurl: envVars.API_BASE_URL,
    serverurl: envVars.SERVER_BASE_URL,
    env: envVars.ENVIRONMENT
};
exports.default = config;
