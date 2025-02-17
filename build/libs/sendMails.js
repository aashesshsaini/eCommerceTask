"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderPlacedEmail = exports.forgotPasswordEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const forgotPasswordTemplatePath = path_1.default.join(__dirname, "../../views/email/resetPassword.hbs");
const forgotPasswordTemplate = fs_1.default.readFileSync(forgotPasswordTemplatePath, "utf8");
const orderPlacedTemplatePath = path_1.default.join(__dirname, "../../views/email/orderPlaced.hbs");
const orderPlacedTemplate = fs_1.default.readFileSync(orderPlacedTemplatePath, "utf8");
const forgotPasswordEmailTemplate = handlebars_1.default.compile(forgotPasswordTemplate);
const orderPlacedEmailTemplate = handlebars_1.default.compile(orderPlacedTemplate);
const createTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    var transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_1.default.smtp.email,
            pass: config_1.default.smtp.password,
        },
    });
    return transporter;
});
const sendEmail = (emailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let emailTransporter = yield createTransporter();
    yield emailTransporter.sendMail(emailOptions);
});
exports.sendEmail = sendEmail;
const forgotPasswordEmail = (email, token, userName) => __awaiter(void 0, void 0, void 0, function* () {
    var info = {
        from: config_1.default.smtp.email,
        to: email,
        subject: "Password Reset Request for e-commerceTask website",
        html: forgotPasswordEmailTemplate({
            apiBaseUrl: config_1.default.baseurl,
            title: "Forgot Password",
            token,
            userName,
        }),
    };
    yield (0, exports.sendEmail)(info);
});
exports.forgotPasswordEmail = forgotPasswordEmail;
const orderPlacedEmail = (email, userName, productName, amount, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ email, userName, productName });
    var info = {
        from: config_1.default.smtp.email,
        to: email,
        subject: "Order Placed !!",
        html: orderPlacedEmailTemplate({
            title: "Order Placed",
            userName,
            productName,
            amount,
            quantity
        }),
    };
    yield (0, exports.sendEmail)(info);
});
exports.orderPlacedEmail = orderPlacedEmail;
