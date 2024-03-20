import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';


const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});


export async function sendEmail(options) {
    const info = await transporter.sendMail({
      from: `"Job Search Application" <${process.env.GMAIL_EMAIL}>`, // sender address
      to: options.email ? options.email : options.recoveryEmail, // list of receivers
      subject: "Email Verification", // Subject line
      html: emailTemplate(options.api, options.firstName, options.fullName) // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}


export async function sendCompanyEmail(options) {
    const info = await transporter.sendMail({
      from: `"Job Search Application" <${process.env.GMAIL_EMAIL}>`, // sender address
      to: options.companyEmail, // list of receivers
      subject: "Email Verification", // Subject line
      html: emailTemplate(options.api, options.companyName) // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

