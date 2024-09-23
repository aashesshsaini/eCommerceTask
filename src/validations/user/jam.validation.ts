import Joi from 'joi';
import { JOI, GENRE} from '../../config/appConstant';

 const jamCreate = {
    body: Joi.object().keys({
       jamName: Joi.string().required(),
       date: Joi.date().required(),
       time: Joi.array().items({
        startTime: Joi.string().required(),
        endTime: Joi.string().required()
       }),
       genre:Joi.string().valid(...Object.values(GENRE)).required(),
       repertoire:Joi.string().required(),
       bandFormation:Joi.array().items(Joi.string().required()),
       city:Joi.string().required(),
       region:Joi.string().required(),
       landmark:Joi.string().required(),
       description:Joi.string().required(),
       allowMusicians:Joi.boolean().required(),
       notifyFavMusicians:Joi.boolean().required()
    })
}

const jamGet = {
   query: Joi.object().keys({
      genre: Joi.string().valid(...Object.values(GENRE)),
      date: Joi.date(),
      search: Joi.string().allow(" ", null),
      latitude: Joi.number().default(0).min(-90).max(90),
      longitude: Joi.number().default(0).min(-180).max(180),
      page: JOI.PAGE,
      limti: JOI.PAGE
   })
}

const jamUpdate = {
   body: Joi.object().keys({
      jamId: JOI.OBJECTID,
      jamName: Joi.string(),
       date: Joi.date(),
       time: Joi.array().items({
        startTime: Joi.string(),
        endTime: Joi.string()
       }),
       genre:Joi.string(),
       repertoire:Joi.string(),
       bandFormation:Joi.array().items(Joi.string()),
       city:Joi.string(),
       region:Joi.string(),
       landmark:Joi.string(),
       description:Joi.string(),
       allowMusicians:Joi.boolean(),
       notifyFavMusicians:Joi.boolean()
   })
}

const jamDelete = {
   query: Joi.object().keys({
      jamId: JOI.OBJECTID
   })
}

export default {jamCreate, jamGet, jamUpdate, jamDelete}