import Joi from 'joi';
import { JOI } from '../../config/appConstant';

 const signup = {
    body: Joi.object().keys({
        fullName: Joi.string().required(),
        mobileNumber: JOI.PHONENUMBER,
        countryCode: Joi.string().required(),
        email: JOI.EMAIL,
        password: JOI.PASSWORD,
    })
}

const verifyOtp = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

 const login = {
    body: Joi.object().keys({
        email: JOI.EMAIL,
        password: JOI.PASSWORD
    })
}


 const changePassword = {
    body: Joi.object().keys({
        newPassword: JOI.PASSWORD,
        oldPassword: JOI.PASSWORD
    })
}

 const logout = {
  body: Joi.object().keys({})
}

const editProfile = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    profileImage: Joi.string(),
    // mobileNumber: Joi.string()
    // .min(5)
    // .max(15)
    // .pattern(/^[0-9]+$/),
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL
  })
}

const forgotPage = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
}

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
}

export default {signup, verifyOtp, login , changePassword, logout, editProfile, forgotPassword, forgotPage, resetForgotPassword}
