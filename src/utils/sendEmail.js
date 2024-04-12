const nodeMailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port:587,
        // service:process.env.SMTP_SERVICE,
        // address: '127.0.0.12',
        secure:false,
        requireTLS:true,
        auth:{
            user:process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    }))

    // transporter.verify((err, success) => {
    //     console.log("jbyulcfvukugvb")
    //     if (err) console.error(err);
    //     else console.log('Your config is correct');
    // });

    const mailOptions = {
        form: process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    console.log("jost " + transporter)
console.log("fefef")
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail