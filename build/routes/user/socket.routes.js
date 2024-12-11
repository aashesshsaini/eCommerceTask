"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const socket_validation_1 = __importDefault(require("../../validations/user/socket.validation"));
const socket_controller_1 = __importDefault(require("../../controllers/user/socket.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.get("/notificationListing", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(socket_validation_1.default.notificationListing), socket_controller_1.default.notificationListing);
router.get("/chats", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(socket_validation_1.default.getChats), socket_controller_1.default.getChats);
