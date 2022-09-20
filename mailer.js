require('dotenv').config();
const nodemailer= require('nodemailer');
const Mail = require('nodemailer/lib/mailer');


const client = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "thebraingrouptz@gmail.com",
        pass: process.env.MAIL_PASSWORD
    }
});
const sendEmail=(from_,to_,subject_,message,htmlMessage)=>{
    try {        
        client.sendMail(
            {
                from: from_,
                to: to_,
                subject: subject_,
                text: message,
                html:htmlMessage
            }
        )
    } catch (error) {
        console.log(error);
    }
}

module.exports={sendEmail}