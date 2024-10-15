import Joi from 'joi';
import { JOI, COMMITMENT_LEVEL} from '../../config/appConstant';

 const signup = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
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

const resendOtp = {
  body: Joi.object().keys({})
}

const createProfile = {
  body: Joi.object().keys({
    zipCode: Joi.string(),
    profileImage: Joi.string(),
    genre: Joi.string(),
    instrument: Joi.string(),
    commitmentLevel: Joi.string().valid(...Object.values(COMMITMENT_LEVEL)),
    repertoire: Joi.array().items(Joi.string()).max(3),
    bio: Joi.string(),
    document: Joi.string(),
    proficient: Joi.string(),
    improvisationalSkill: Joi.string(),
    motivation: Joi.string(),
    aboutRepertoire: Joi.string(),
    publicExpirence: Joi.string()
  })
}

 const login = {
    body: Joi.object().keys({
        mobileNumber: Joi.string()
        .min(5)
        .max(15)
        .pattern(/^[0-9]+$/),
        email: Joi.string().email().lowercase().trim(),
        password: JOI.PASSWORD,
        page:JOI.PAGE,
        limit:JOI.LIMIT
    })
}


 const changePassword = {
    body: Joi.object().keys({
        newPassword: JOI.PASSWORD,
        oldPassword: JOI.PASSWORD
    })
}

const deleteAccount = {
  query: Joi.object().keys({
    password: JOI.PASSWORD
  })
}

 const logout = {
  body: Joi.object().keys({})
}

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
    document: Joi.string(),
  })
}

const editQuestionnaire = {
  body: Joi.object().keys({
    proficient: Joi.string(),
    improvisationalSkill: Joi.string(),
    motivation: Joi.string(),
    aboutRepertoire: Joi.string(),
    publicExpirence: Joi.string()
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

const userInfo = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT
  })
}

export default {signup, verifyOtp, resendOtp, createProfile, login , changePassword, deleteAccount, logout, editProfile, editQuestionnaire, forgotPassword, forgotPage, resetForgotPassword, userInfo}
