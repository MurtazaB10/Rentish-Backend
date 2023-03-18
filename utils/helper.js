import nodemailer from "nodemailer";
import sendgrid from "@sendgrid/mail";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from "twilio";
const client = twilio(
  "AC292665253c85ec56ae7ba43acd12dbf7",
  "3c92fcfcc073d2eaecc55b9f4488792e"
);
const helper = {
  generateOtp: () => {
    let otp = "";
    for (let i = 0; i < 4; i++) {
      const rv = Math.round(Math.random() * 9);
      otp = otp + rv;
    }
    return otp;
  },
  mailTransport: () => {
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    return transport;
  },
  sendMail: (email, subject, text, html) => {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "rentish7474@gmail.com",
      subject: subject,
      text: text,
      html: html,
    };
    sendgrid
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  },
  sendSMS: (number, text) => {
    client.messages
      .create({ body: text, from: "+18087363722", to: "+91" + number })
      .then((message) => console.log(message.sid))
      .catch((e) => console.log(e));
  },
};
export default helper;
