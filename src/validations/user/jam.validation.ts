import Joi from "joi";
import { objectId } from "../custom.validation";
import { JOI, GENRE, COMMITMENT_LEVEL } from "../../config/appConstant";

const jamCreate = {
  body: Joi.object().keys({
    jamName: Joi.string().required(),
    availableDates: Joi.array()
      .items(
        Joi.object({
          date: Joi.date().required(),
          slots: Joi.array()
            .items(
              Joi.object({
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
              })
            )
            .required(),
        })
      )
      .required(),
    //  date: Joi.date().required(),
    //  time: Joi.array().items({
    //   startTime: Joi.string().required(),
    //   endTime: Joi.string().required()
    //  }),
    genre: Joi.string()
      .valid(...Object.values(GENRE))
      .required(),
    repertoire: Joi.array().items(Joi.string().required()),
    commitmentLevel: Joi.string()
      .valid(...Object.values(COMMITMENT_LEVEL))
      .required(),
    image: Joi.string().allow("", null),
    bandFormation: Joi.array().items(
      Joi.object().keys({
        instrument: Joi.string().required(),
        type: Joi.string().valid("mandatory", "optional"),
      })
    ),
    //  city:Joi.string().required(),
    //  region:Joi.string().required(),
    landmark: Joi.string().required(),
    latitude: Joi.number().default(0).min(-90).max(90),
    longitude: Joi.number().default(0).min(-180).max(180),
    description: Joi.string().required(),
    allowMusicians: Joi.boolean().required(),
    notifyFavMusicians: Joi.boolean().required(),
  }),
};

const jamGet = {
  query: Joi.object().keys({
    genre: Joi.string().valid(...Object.values(GENRE)),
    date: Joi.date(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    search: Joi.string().allow(" ", null),
    latitude: Joi.number().default(0).min(-90).max(90),
    longitude: Joi.number().default(0).min(-180).max(180),
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    commitmentLevel: Joi.string().valid(...Object.values(COMMITMENT_LEVEL)),
    instrument: Joi.string(),
    distance: Joi.number()
  }),
};

const jamUpdate = {
  body: Joi.object().keys({
    jamId: JOI.OBJECTID,
    jamName: Joi.string(),
    availableDates: Joi.array().items(
      Joi.object({
        date: Joi.date(),
        slots: Joi.array().items(
          Joi.object({
            startTime: Joi.string(),
            endTime: Joi.string(),
          })
        ),
      })
    ),
    genre: Joi.string(),
    repertoire: Joi.array().items(Joi.string()),
    bandFormation: Joi.array().items(
      Joi.object().keys({
        instrument: Joi.string().required(),
        type: Joi.string().valid("mandatory", "optional"),
      })
    ),
    //  city:Joi.string(),
    //  region:Joi.string(),
    landmark: Joi.string(),
    commitmentLevel: Joi.string().valid(...Object.values(COMMITMENT_LEVEL)),
    latitude: Joi.number().default(0).min(-90).max(90),
    longitude: Joi.number().default(0).min(-180).max(180),
    image: Joi.string().allow("", null),
    description: Joi.string(),
    allowMusicians: Joi.boolean(),
    notifyFavMusicians: Joi.boolean(),
  }),
};

const jamDelete = {
  query: Joi.object().keys({
    jamId: JOI.OBJECTID,
  }),
};

const jamInfo = {
  query: Joi.object().keys({
    jamId: JOI.OBJECTID,
  }),
};

const cancelJam = {
  body: Joi.object().keys({
    jamId: JOI.OBJECTID,
  }),
};

const getUsers = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    search: Joi.string().allow("", null),
    latitude: Joi.number().default(0).min(-90).max(90),
    longitude: Joi.number().default(0).min(-180).max(180),
    commitmentLevel: Joi.string().valid(...Object.values(COMMITMENT_LEVEL)),
    genre: Joi.string().valid(...Object.values(GENRE)),
    instrument: Joi.string(),
    jamId: Joi.string().custom(objectId),
  }),
};

const favMember = {
  body: Joi.object().keys({
    favMemId: JOI.OBJECTID,
  }),
};

const favMemberGet = {
  query: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    search: Joi.string().allow("", null),
    jamId: Joi.string().custom(objectId),
  }),
};

const inviteMembers = {
  body: Joi.object().keys({
    memberId: Joi.array().items(JOI.OBJECTID),
    jamId: JOI.OBJECTID,
  }),
};

const acceptJam = {
  body: Joi.object().keys({
    jamId: JOI.OBJECTID,
    case: Joi.string().valid("accept", "reject"),
  }),
};

export default {
  jamCreate,
  jamGet,
  jamUpdate,
  jamDelete,
  jamInfo,
  cancelJam,
  getUsers,
  favMember,
  favMemberGet,
  inviteMembers,
  acceptJam,
};
