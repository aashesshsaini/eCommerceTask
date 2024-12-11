import Joi from "joi";
import { JOI } from "../../config/appConstant";
import { objectId } from "../custom.validation";

const getChats = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    jamId: JOI.OBJECTID,
  }),
};

const notificationListing = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
  }),
};

export default { getChats, notificationListing };
