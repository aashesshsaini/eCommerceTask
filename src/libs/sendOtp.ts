import config from "../config/config";
import moment from 'moment';
import { ErrorRequestHandler } from "express";

const sendOtp = async (phoneNumber:string, countryCode:string) => {
  return new Promise((resolve, reject) => {
    var accountSid = config.twilio.accountSID; // Your Account SID from www.twilio.com/console
    var authToken = config.twilio.accountSecret; // Your Auth Token from www.twilio.com/console
   console.log(accountSid, '/n', authToken)
    // var OTP = Math.floor(Math.random() * 899999 + 100000);
    var OTP = "111112"
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        body: "Your fit-fi account verification code is " + OTP,

        from: config.twilio.phoneNumber,
        to: countryCode + phoneNumber,
      })
      .then(() => {
        let otpExpires = new Date();
        otpExpires.setSeconds(otpExpires.getSeconds() + 240);
        let otp:{code:string, expiresAt: Date} = {
           code : OTP,
        expiresAt :otpExpires
        };
        
        console.log(otp, "otp..............")
        resolve(otp);
      })
      .catch((err:ErrorRequestHandler) => {
        console.log(err);
        reject(err);
      });
  });

//   let otpExpires = new Date();
//   otpExpires.setSeconds(otpExpires.getSeconds() + 240);

//   let otp = {};
//   otp = { code: "", expiresAt: "" };
//   otp.code = 222222;
//   otp.expiresAt = otpExpires;
//   return otp;
};

export default sendOtp