"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../custom.validation");
const appConstant_1 = require("../../config/appConstant");
const jamCreate = {
    body: joi_1.default.object().keys({
        jamName: joi_1.default.string().required(),
        availableDates: joi_1.default.array()
            .items(joi_1.default.object({
            date: joi_1.default.date().required(),
            slots: joi_1.default.array()
                .items(joi_1.default.object({
                startTime: joi_1.default.string().required(),
                endTime: joi_1.default.string().required(),
            }))
                .required(),
        }))
            .required(),
        //  date: Joi.date().required(),
        //  time: Joi.array().items({
        //   startTime: Joi.string().required(),
        //   endTime: Joi.string().required()
        //  }),
        genre: joi_1.default.string()
            .valid(...Object.values(appConstant_1.GENRE))
            .required(),
        repertoire: joi_1.default.array().items(joi_1.default.string().required()),
        commitmentLevel: joi_1.default.string()
            .valid(...Object.values(appConstant_1.COMMITMENT_LEVEL))
            .required(),
        image: joi_1.default.string().allow("", null),
        bandFormation: joi_1.default.array().items(joi_1.default.object().keys({
            instrument: joi_1.default.string().required(),
            type: joi_1.default.string().valid("mandatory", "optional"),
        })),
        //  city:Joi.string().required(),
        //  region:Joi.string().required(),
        landmark: joi_1.default.string().required(),
        latitude: joi_1.default.number().default(0).min(-90).max(90),
        longitude: joi_1.default.number().default(0).min(-180).max(180),
        description: joi_1.default.string().required(),
        allowMusicians: joi_1.default.boolean().required(),
        notifyFavMusicians: joi_1.default.boolean().required(),
    }),
};
const jamGet = {
    query: joi_1.default.object().keys({
        genre: joi_1.default.string().valid(...Object.values(appConstant_1.GENRE)),
        date: joi_1.default.date(),
        startDate: joi_1.default.date(),
        endDate: joi_1.default.date(),
        search: joi_1.default.string().allow(" ", null),
        latitude: joi_1.default.number().default(0).min(-90).max(90),
        longitude: joi_1.default.number().default(0).min(-180).max(180),
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        commitmentLevel: joi_1.default.string().valid(...Object.values(appConstant_1.COMMITMENT_LEVEL)),
        instrument: joi_1.default.string(),
        distance: joi_1.default.number()
    }),
};
const jamUpdate = {
    body: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
        jamName: joi_1.default.string(),
        availableDates: joi_1.default.array().items(joi_1.default.object({
            date: joi_1.default.date(),
            slots: joi_1.default.array().items(joi_1.default.object({
                startTime: joi_1.default.string(),
                endTime: joi_1.default.string(),
            })),
        })),
        genre: joi_1.default.string(),
        repertoire: joi_1.default.array().items(joi_1.default.string()),
        bandFormation: joi_1.default.array().items(joi_1.default.object().keys({
            instrument: joi_1.default.string().required(),
            type: joi_1.default.string().valid("mandatory", "optional"),
        })),
        //  city:Joi.string(),
        //  region:Joi.string(),
        landmark: joi_1.default.string(),
        commitmentLevel: joi_1.default.string().valid(...Object.values(appConstant_1.COMMITMENT_LEVEL)),
        latitude: joi_1.default.number().default(0).min(-90).max(90),
        longitude: joi_1.default.number().default(0).min(-180).max(180),
        image: joi_1.default.string().allow("", null),
        description: joi_1.default.string(),
        allowMusicians: joi_1.default.boolean(),
        notifyFavMusicians: joi_1.default.boolean(),
    }),
};
const jamDelete = {
    query: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
    }),
};
const jamInfo = {
    query: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
    }),
};
const cancelJam = {
    body: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
    }),
};
const getUsers = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow("", null),
        latitude: joi_1.default.number().default(0).min(-90).max(90),
        longitude: joi_1.default.number().default(0).min(-180).max(180),
        commitmentLevel: joi_1.default.string().valid(...Object.values(appConstant_1.COMMITMENT_LEVEL)),
        genre: joi_1.default.string().valid(...Object.values(appConstant_1.GENRE)),
        instrument: joi_1.default.string(),
        jamId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const favMember = {
    body: joi_1.default.object().keys({
        favMemId: appConstant_1.JOI.OBJECTID,
        jamId: appConstant_1.JOI.OBJECTID,
    }),
};
const favMemberGet = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow("", null),
    }),
};
const inviteMembers = {
    body: joi_1.default.object().keys({
        memberId: joi_1.default.array().items(appConstant_1.JOI.OBJECTID),
        jamId: appConstant_1.JOI.OBJECTID,
    }),
};
const acceptJam = {
    body: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
        case: joi_1.default.string().valid("accept", "reject"),
    }),
};
exports.default = {
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
