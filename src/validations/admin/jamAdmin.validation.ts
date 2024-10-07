import Joi from 'joi';
import { JOI, GENRE} from '../../config/appConstant';


const getJams = {
    query : Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow("", null)
    })
}

export default {getJams}