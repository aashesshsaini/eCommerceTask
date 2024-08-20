import Joi from 'joi';
import { JOI } from '../../config/appConstant';

 const login = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    password: JOI.PASSWORD,
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: JOI.PASSWORD,
    newPassword: JOI.PASSWORD
  })
}

export default {login, changePassword}
