const sendEmail = require('./mailer').mailer;

exports.inviteByEmail = (to, password, name) => {
    let mail = {
        from: "Admin",
        to: to,
        subject: "login credentials",
        text: `welcome ${name} please use your email ${to} and password ${password} to change your password then login`,
    }

    sendEmail(mail.from, mail.to, mail.text);
}