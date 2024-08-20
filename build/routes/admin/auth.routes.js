"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const auth_validation_1 = __importDefault(require("../../validations/admin/auth.validation"));
const auth_controller_1 = __importDefault(require("../../controllers/admin/auth.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.post('/login', (0, validate_1.validate)(auth_validation_1.default.login), auth_controller_1.default.login);
router.put('/logout', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), auth_controller_1.default.logout);
router.put('/changePassword', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(auth_validation_1.default.changePassword), auth_controller_1.default.changePassword);
exports.default = router;
