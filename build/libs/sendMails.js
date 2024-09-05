"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordEmail = forgotPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const forgotPasswordTemplatePath = path_1.default.join(__dirname, "../../views/email/resetPassword.hbs");
const forgotPasswordTemplate = fs_1.default.readFileSync(forgotPasswordTemplatePath, "utf8");
const forgotPasswordEmailTemplate = handlebars_1.default.compile(forgotPasswordTemplate);
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.default.smtp.email,
        pass: config_1.default.smtp.password
    }
});
function forgotPasswordEmail(email, token) {
    return new Promise((resolve, reject) => {
        console.log(config_1.default.baseurl);
        const info = {
            from: config_1.default.smtp.email,
            to: email,
            subject: "Forgot Password Email",
            html: forgotPasswordEmailTemplate({
                title: "Forgot Password Email",
                token: token,
                apiBaseUrl: config_1.default.serverurl
            })
        };
        transporter.sendMail(info, (error, info) => {
            if (error) {
                return reject(error);
            }
            console.log("Email sent successfully", info);
            resolve();
        });
    });
}
