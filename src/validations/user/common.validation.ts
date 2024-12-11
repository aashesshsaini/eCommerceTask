import Joi from "joi";
import { JOI, REPORT_TYPE } from "../../config/appConstant";

const contactUs = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    message: Joi.string().required(),
  }),
};

const report = {
  body: Joi.object().keys({
    reportedTo: JOI.OBJECTID,
    reportType: Joi.string()
      .valid(...Object.values(REPORT_TYPE))
      .required(),
  }),
};

export default { contactUs, report };
