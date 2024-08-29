import Joi from 'joi';
import { JOI} from '../../config/appConstant';

const contactUs = {
    body: Joi.object().keys({
        email: JOI.EMAIL,
        message: Joi.string().required()
    })
}

export default {contactUs}