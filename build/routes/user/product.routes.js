"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const product_validation_1 = __importDefault(require("../../validations/user/product.validation"));
const product_controller_1 = __importDefault(require("../../controllers/user/product.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(product_validation_1.default.getProducts), product_controller_1.default.getProducts);
router.post('/addRemoveToCart', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(product_validation_1.default.addRemoveToCart), product_controller_1.default.addRemoveToCart);
router.post('/createOrder', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(product_validation_1.default.createOrder), product_controller_1.default.createOrder);
router.post('/webhook', product_controller_1.default.webhook);
exports.default = router;
