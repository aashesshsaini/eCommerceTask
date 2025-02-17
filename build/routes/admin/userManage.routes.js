"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const userManage_validation_1 = __importDefault(require("../../validations/admin/userManage.validation"));
const userManage_controller_1 = __importDefault(require("../../controllers/admin/userManage.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.delete('/deleteUser', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(userManage_validation_1.default.deleteUser), userManage_controller_1.default.deleteUser);
router.get('/userInfo', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(userManage_validation_1.default.userInfo), userManage_controller_1.default.userInfo);
router.get('/getUsers', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(userManage_validation_1.default.getUsers), userManage_controller_1.default.getUsers);
router.put('/userBlock', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(userManage_validation_1.default.userBlock), userManage_controller_1.default.userBlock);
router.get('/dashboard', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(userManage_validation_1.default.dashboard), userManage_controller_1.default.dashboard);
exports.default = router;
