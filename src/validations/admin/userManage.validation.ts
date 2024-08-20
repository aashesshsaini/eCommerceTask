import Joi from 'joi';
import { JOI } from '../../config/appConstant';

const addUser = {
   body: Joi.object().keys({
    email: JOI.EMAIL,
    password: JOI.PASSWORD
   })
}

const deleteUser = {
    query: Joi.object().keys({
      userId: JOI.OBJECTID,
    }),
  };

  const userBlock = {
    body: Joi.object().keys({
      userId: JOI.OBJECTID,
    }),
  };
  
  const getUsers = {
    query: Joi.object().keys({
      limit: JOI.LIMIT,
      page: JOI.PAGE,
      search: Joi.string().allow("", null),
    }),
  };
  
  const userInfo = {
    query: Joi.object().keys({
      userId: JOI.OBJECTID,
    }),
  };
  
  
  const dashboard = {
    query: Joi.object().keys({
      // token: Joi.string().required()
    })
  }

export default {addUser, deleteUser, userBlock, getUsers, userInfo, dashboard}