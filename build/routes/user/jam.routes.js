"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const jam_validation_1 = __importDefault(require("../../validations/user/jam.validation"));
const jam_controller_1 = __importDefault(require("../../controllers/user/jam.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.route('/')
    .post((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.jamCreate), jam_controller_1.default.jamCreate)
    .get((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.jamGet), jam_controller_1.default.jamGet)
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.jamUpdate), jam_controller_1.default.jamUpdate)
    .delete((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.jamDelete), jam_controller_1.default.jamDelete);
router.get('/jamInfo', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.jamInfo), jam_controller_1.default.jamInfo);
router.put('/cancelJam', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.cancelJam), jam_controller_1.default.cancelJam);
router.get('/users', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.getUsers), jam_controller_1.default.getUsers);
router.route('/favMember')
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.favMember), jam_controller_1.default.favMember)
    .get((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.favMemberGet), jam_controller_1.default.favMemberGet);
router.route("/inviteMembers")
    .post((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.inviteMembers), jam_controller_1.default.inviteMembers)
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(jam_validation_1.default.acceptJam), jam_controller_1.default.acceptJam);
exports.default = router;
