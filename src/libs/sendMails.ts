import nodemailer from "nodemailer";
import config from "../config/config";
import fs from 'fs';
import path from "path";
import handlebars from "handlebars";

const forgotPasswordTemplatePath = path.join(__dirname, "../../views/email/resetPassword.hbs");
const forgotPasswordTemplate = fs.readFileSync(forgotPasswordTemplatePath, "utf8");


const forgotPasswordEmailTemplate = handlebars.compile(forgotPasswordTemplate);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.smtp.email,
        pass: config.smtp.password
    }
});


interface forgotPasswordEmailInfo {
    from: string | undefined;
    to: string;
    subject: string;
    html: string;
}

function forgotPasswordEmail(email: string, token: string | undefined): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log(config.baseurl)
        const info: forgotPasswordEmailInfo = {
            from: config.smtp.email,  
            to: email, 
            subject: "Forgot Password Email",
            html: forgotPasswordEmailTemplate({
                title: "Forgot Password Email",
                token: token,
                apiBaseUrl: config.serverurl
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

export {forgotPasswordEmail};
