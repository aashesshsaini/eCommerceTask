"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const auth_validation_1 = __importDefault(require("../../validations/user/auth.validation"));
const auth_controller_1 = __importDefault(require("../../controllers/user/auth.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.post("/signup", (0, validate_1.validate)(auth_validation_1.default.signup), auth_controller_1.default.signup);
router.post("/verifyOtp", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.verifyOtp), auth_controller_1.default.verifyOtp);
router.post("/resendOtp", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.resendOtp), auth_controller_1.default.resendOtp);
router.post("/createProfile", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.createProfile), auth_controller_1.default.createProfile);
router.post("/login", (0, validate_1.validate)(auth_validation_1.default.login), auth_controller_1.default.login);
router.put("/changePassword", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.changePassword), auth_controller_1.default.changePassword);
router.delete("/deleteAccount", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.deleteAccount), auth_controller_1.default.deleteAccount);
router.put("/logout", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.logout), auth_controller_1.default.logout);
router.put("/editProfile", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.editProfile), auth_controller_1.default.editProfile);
router.put("/editQuestionnaire", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.editQuestionnaire), auth_controller_1.default.editQuestionnaire);
router.post("/forgotPassword", (0, validate_1.validate)(auth_validation_1.default.forgotPassword), auth_controller_1.default.forgotPassword);
router
    .route("/resetPassword")
    .get((0, validate_1.validateView)(auth_validation_1.default.forgotPage), auth_controller_1.default.forgotPage)
    .post((0, validate_1.validateView)(auth_validation_1.default.resetForgotPassword), auth_controller_1.default.resetForgotPassword);
router.get("/userInfo", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.userInfo), auth_controller_1.default.userInfo);
router.post("/location", (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(auth_validation_1.default.location), auth_controller_1.default.location);
exports.default = router;
