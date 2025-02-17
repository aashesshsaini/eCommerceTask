import nodemailer from "nodemailer";
import config from "../config/config";
import fs from 'fs';
import path from "path";
import handlebars from "handlebars";
import { Dictionary } from "../types";

const forgotPasswordTemplatePath = path.join(__dirname, "../../views/email/resetPassword.hbs");
const forgotPasswordTemplate = fs.readFileSync(forgotPasswordTemplatePath, "utf8");

const orderPlacedTemplatePath = path.join(__dirname, "../../views/email/orderPlaced.hbs");
const orderPlacedTemplate = fs.readFileSync(orderPlacedTemplatePath, "utf8");


const forgotPasswordEmailTemplate = handlebars.compile(forgotPasswordTemplate);
const orderPlacedEmailTemplate = handlebars.compile(orderPlacedTemplate);

const createTransporter = async () => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.smtp.email,
            pass: config.smtp.password,
        },
    });
    return transporter;
};

export const sendEmail = async (emailOptions: Dictionary) => {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
};


export const forgotPasswordEmail = async (email: string, token: string, userName: string) => {
    var info = {
        from: config.smtp.email,
        to: email,
        subject: "Password Reset Request for e-commerceTask website",
        html: forgotPasswordEmailTemplate({
            apiBaseUrl: config.baseurl,
            title: "Forgot Password",
            token,
            userName,
        }),
    };
    await sendEmail(info);
};

export const orderPlacedEmail = async (email: string, userName: string, productName: string, amount: number, quantity: number) => {
    console.log({ email, userName, productName })
    var info = {
        from: config.smtp.email,
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
    await sendEmail(info);
};