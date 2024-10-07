"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const jamCreate = {
    body: joi_1.default.object().keys({
        jamName: joi_1.default.string().required(),
        date: joi_1.default.date().required(),
        time: joi_1.default.array().items({
            startTime: joi_1.default.string().required(),
            endTime: joi_1.default.string().required()
        }),
        genre: joi_1.default.string().valid(...Object.values(appConstant_1.GENRE)).required(),
        repertoire: joi_1.default.string().required(),
        bandFormation: joi_1.default.array().items(joi_1.default.string().required()),
        city: joi_1.default.string().required(),
        region: joi_1.default.string().required(),
        landmark: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        allowMusicians: joi_1.default.boolean().required(),
        notifyFavMusicians: joi_1.default.boolean().required()
    })
};
const jamGet = {
    query: joi_1.default.object().keys({
        genre: joi_1.default.string().valid(...Object.values(appConstant_1.GENRE)),
        date: joi_1.default.date(),
        search: joi_1.default.string().allow(" ", null),
        latitude: joi_1.default.number().default(0).min(-90).max(90),
        longitude: joi_1.default.number().default(0).min(-180).max(180),
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT
    })
};
const jamUpdate = {
    body: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
        jamName: joi_1.default.string(),
        date: joi_1.default.date(),
        time: joi_1.default.array().items({
            startTime: joi_1.default.string(),
            endTime: joi_1.default.string()
        }),
        genre: joi_1.default.string(),
        repertoire: joi_1.default.string(),
        bandFormation: joi_1.default.array().items(joi_1.default.string()),
        city: joi_1.default.string(),
        region: joi_1.default.string(),
        landmark: joi_1.default.string(),
        description: joi_1.default.string(),
        allowMusicians: joi_1.default.boolean(),
        notifyFavMusicians: joi_1.default.boolean()
    })
};
const jamDelete = {
    query: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID
    })
};
const getUsers = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow("", null)
    })
};
const favMember = {
    body: joi_1.default.object().keys({
        favMemId: appConstant_1.JOI.OBJECTID,
    })
};
const favMemberGet = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT
    })
};
const inviteMembers = {
    body: joi_1.default.object().keys({
        memberId: joi_1.default.array().items(appConstant_1.JOI.OBJECTID),
        jamId: appConstant_1.JOI.OBJECTID
    })
};
const acceptJam = {
    body: joi_1.default.object().keys({
        jamId: appConstant_1.JOI.OBJECTID,
        case: joi_1.default.string().valid('accept', 'reject')
    })
};
exports.default = { jamCreate, jamGet, jamUpdate, jamDelete, getUsers, favMember, favMemberGet, inviteMembers, acceptJam };
