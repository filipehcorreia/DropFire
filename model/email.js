var nodemailer = require('nodemailer');
var Secret = require("./secrets.js");

const gmailPassSecret = new Secret({
    key: 'GMAIL_PASS'
});


const GMAIL_LOCAL_USER = "flmrcn@gmail.com";
const GMAIL_LOCAL_PASS = "passwordsegura!";

const Email = function(user) {
    this.firstName = user.firstName;
    this.email = user.email;
    this.recovery_key = user.recovery_key;
};

Email.sendEmail = async (Email, result) => {
    var gmailPassword;

    await Secret.get(gmailPassSecret, (error, result) => {
        gmailPassword = result;
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || GMAIL_LOCAL_USER,
            pass: gmailPassword || GMAIL_LOCAL_PASS
        }
    });

    var mailOptions = {
        from: process.env.GMAIL_USER,
        to: Email.email,
        subject: 'Welcome to DropFire',
        html: `Thank you ${Email.firstName} for registering in DropFire! <br> 
        Here's your recovery key : ${Email.recovery_key} <br>
        You will need this key to change your password. Keep it safe <br>
        Best Regards, <br><br>
        <strong>The DropFire team.<strong>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = Email;