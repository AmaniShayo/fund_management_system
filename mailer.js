require('dotenv').config();
const nodemailer = require('nodemailer');
const sendEmail = (from_, to_, subject_, message) => {
    try {

        const client = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "thebraingrouptz@gmail.com",
                pass: process.env.MAIL_PASSWORD
            }
        });

        client.sendMail(
            {
                from: from_,
                to: to_,
                subject: subject_,
                text: message
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const inviteByEmail = (to, password, name) => {
    let mail = {
        from: "Admin",
        to: to,
        subject: "login credentials",
        text: `welcome ${name} please use your email ${to} and password ${password} to change your password then login`,
    }

    sendEmail(mail.from, mail.to, mail.text);
}

const otpEmail = (to, otp) => {
    let otpMailObject = {
        from: "fund request sytem",
        to: to,
        subject: "OTP for password reset",
        text: `use one time password: ${otp} to reset your password. the code expires in 10 minutes`
    }
    sendEmail(otpMailObject.from, otpMailObject.to, otpMailObject.subject, otpMailObject.text);
}
module.exports = { inviteByEmail, otpEmail };