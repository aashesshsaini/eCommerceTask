import Joi from "joi";
import { JOI} from "../../config/appConstant";

const signup = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobileNumber: JOI.PHONENUMBER,
    countryCode: Joi.string().required(),
    email: JOI.EMAIL,
    password: JOI.PASSWORD,
    profileImage:Joi.string()
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
    profileImage: Joi.string(),
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
  }),
};

export default {
  signup,
  login,
  changePassword,
  deleteAccount,
  logout,
  editProfile,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
  userInfo,
};
