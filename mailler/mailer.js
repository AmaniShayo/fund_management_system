require('dotenv').config({path:'../.env'});
const nodemailer = require('nodemailer');

exports.mailer = async (from_, to_, subject_, message) => {
    try {

        const client = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "thebraingrouptz@gmail.com",
                pass: process.env.MAIL_PASSWORD
            }
        });

        await client.sendMail(
            {
                from: from_,
                to: to_,
                subject: subject_,
                text: message
            }
        );
        
    } catch (error) {
        console.log(error);
    }
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