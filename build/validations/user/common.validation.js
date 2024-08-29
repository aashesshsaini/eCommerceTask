"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const contactUs = {
    body: joi_1.default.object().keys({
        email: appConstant_1.JOI.EMAIL,
        message: joi_1.default.string().required()
    })
};
exports.default = { contactUs };
