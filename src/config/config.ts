import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object({
    PORT: Joi.number().required(),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    EMAIL: Joi.string().description("username for email server"),
    PASSWORD: Joi.string().description("password for email server"),
    API_BASE_URL: Joi.string().required().description("Api base url"),
    ADMIN_BASE_URL: Joi.string().description("Admin pannel base url"),
    ACCOUNT_SID: Joi.string().description("account sid for twillio"),
    ACCOUNT_SECRET: Joi.string().description('secret key for twillio'),
    PHONE_NUMBER: Joi.string().description("phon enumber for twilio"),
    // SERVER_BASE_URL: Joi.string().description("Server pannel base url"),
    ENVIRONMENT: Joi.string().valid("development", "production").required()
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
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  smtp: { email: envVars.EMAIL, password: envVars.PASSWORD},
  twilio: {accountSID: envVars.ACCOUNT_SID, accountSecret: envVars.ACCOUNT_SECRET, phoneNumber: envVars.PHONE_NUMBER}, 
  baseurl: envVars.API_BASE_URL,
  serverurl: envVars.SERVER_BASE_URL,
    env: envVars.ENVIRONMENT
};

export default config;
