"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const common_validation_1 = __importDefault(require("../../validations/user/common.validation"));
const common_controller_1 = __importDefault(require("../../controllers/user/common.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
console.log("in common routes.............");
router.post("/contactUs", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(common_validation_1.default.contactUs), common_controller_1.default.contactUs);
router.post("/report", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(common_validation_1.default.report), common_controller_1.default.report);
