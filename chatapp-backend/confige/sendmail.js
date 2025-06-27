const nodemailer = require('nodemailer');


const sendmail = async (to, subject, text) => {



    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "samson.brekke@ethereal.email",
            pass: "rYnQX2KPvaP63YNeSX",
        },
    });

    (async () => {
        const info = await transporter.sendMail({
            from: '"rj to other" <gage28@ethereal.email>',
            to: to,
            subject: subject,
            text: text, // plain‑text body
            html: "", // HTML body
        });

        console.log("Message sent:", info.messageId);
    })();
}

module.exports = sendmail;