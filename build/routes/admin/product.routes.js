"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const product_validation_1 = __importDefault(require("../../validations/admin/product.validation"));
const product_controller_1 = __importDefault(require("../../controllers/admin/product.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.route('/')
    .post((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(product_validation_1.default.createProduct), product_controller_1.default.createProduct)
    .get((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(product_validation_1.default.getProduct), product_controller_1.default.getProduct)
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(product_validation_1.default.updateProduct), product_controller_1.default.updateProduct)
    .delete((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(product_validation_1.default.deleteProduct), product_controller_1.default.deleteProduct);
exports.default = router;
