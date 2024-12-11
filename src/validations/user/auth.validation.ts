import Joi from "joi";
import { JOI, COMMITMENT_LEVEL, LEVEL_DATA } from "../../config/appConstant";

const signup = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobileNumber: JOI.PHONENUMBER,
    countryCode: Joi.string().required(),
    email: JOI.EMAIL,
    password: JOI.PASSWORD,
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const resendOtp = {
  body: Joi.object().keys({}),
};

const createProfile = {
  body: Joi.object().keys({
    zipCode: Joi.string(),
    profileImage: Joi.string(),
    genre: Joi.string(),
    instrument: Joi.string(),
    commitmentLevel: Joi.string().valid(...Object.values(COMMITMENT_LEVEL)),
    repertoire: Joi.array().items(Joi.string()).max(3),
    bio: Joi.string(),
    document: Joi.array().items(Joi.string()),
    caption: Joi.string(),
    proficient: Joi.string().valid(...LEVEL_DATA.proficient),
    improvisationalSkill: Joi.string().valid(
      ...LEVEL_DATA.improvisationalSkill
    ),
    aboutRepertoire: Joi.string().valid(...LEVEL_DATA.aboutRepertoire),
    publicExpirence: Joi.string().valid(...LEVEL_DATA.publicExpirence),
    motivation: Joi.string().valid(...LEVEL_DATA.motivation),
  }),
};

const login = {
  body: Joi.object().keys({
    mobileNumber: Joi.string()
      .min(5)
      .max(15)
      .pattern(/^[0-9]+$/),
    email: Joi.string().email().lowercase().trim(),
    password: JOI.PASSWORD,
    page: JOI.PAGE,
    limit: JOI.LIMIT,
  }),
};

const changePassword = {
  body: Joi.object().keys({
    newPassword: JOI.PASSWORD,
    oldPassword: JOI.PASSWORD,
  }),
};

const deleteAccount = {
  query: Joi.object().keys({
    password: JOI.PASSWORD,
  }),
};

const logout = {
  body: Joi.object().keys({}),
};

const editProfile = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    mobileNumber: Joi.string()
      .min(5)
      .max(15)
      .pattern(/^[0-9]+$/),
    countryCode: Joi.string(),
    email: Joi.string().email().lowercase().trim(),
    zipCode: Joi.string(),
    profileImage: Joi.string(),
    genre: Joi.string(),
    instrument: Joi.string(),
    repertoire: Joi.array().items(Joi.string()).max(3),
    commitmentLevel: Joi.string().valid(...Object.values(COMMITMENT_LEVEL)),
    bio: Joi.string(),
    document: Joi.array().items(Joi.string()),
    caption: Joi.string(),
  }),
};

const editQuestionnaire = {
  body: Joi.object().keys({
    proficient: Joi.string().valid(...LEVEL_DATA.proficient),
    improvisationalSkill: Joi.string().valid(
      ...LEVEL_DATA.improvisationalSkill
    ),
    motivation: Joi.string().valid(...LEVEL_DATA.motivation),
    aboutRepertoire: Joi.string().valid(...LEVEL_DATA.aboutRepertoire),
    publicExpirence: Joi.string().valid(...LEVEL_DATA.publicExpirence),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
  }),
};

const forgotPage = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetForgotPassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Password does not match" }),
  }),
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const userInfo = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
  }),
};

const location = {
  body: Joi.object().keys({
    latitude: Joi.number().default(0.0).min(-90).max(90),
    longitude: Joi.number().default(0.0).min(-180).max(180),
  }),
};

export default {
  signup,
  verifyOtp,
  resendOtp,
  createProfile,
  login,
  changePassword,
  deleteAccount,
  logout,
  editProfile,
  editQuestionnaire,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
  userInfo,
  location,
};
