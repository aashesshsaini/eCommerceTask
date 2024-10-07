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
      limit: JOI.LIMIT
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

const cancelJam = {
   body: Joi.object().keys({
      jamId:JOI.OBJECTID
   })
}

const getUsers = {
   query: Joi.object().keys({
      page: JOI.PAGE,
      limit: JOI.LIMIT,
      search: Joi.string().allow("", null)
   })
}

const favMember = {
   body: Joi.object().keys({
      favMemId: JOI.OBJECTID,
   })
}

const favMemberGet = {
   query: Joi.object().keys({
      page: JOI.PAGE,
      limit: JOI.LIMIT
   })
}

const inviteMembers = {
body: Joi.object().keys({
   memberId: Joi.array().items(JOI.OBJECTID),
   jamId: JOI.OBJECTID
})
}

const acceptJam = {
   body: Joi.object().keys({
      jamId: JOI.OBJECTID,
      case: Joi.string().valid('accept', 'reject')
   })
}

export default {jamCreate, jamGet, jamUpdate, jamDelete, cancelJam, getUsers,favMember, favMemberGet, inviteMembers, acceptJam}