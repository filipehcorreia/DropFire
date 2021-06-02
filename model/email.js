//require everything to make this work

var nodemailer = require('nodemailer');
var Secret = require("./secrets.js");

const gmailPassSecret = new Secret({
    key: 'GMAIL_PASS'
});

/* consts used for local dev only */
const GMAIL_LOCAL_USER = "flmrcn@gmail.com";
const GMAIL_LOCAL_PASS = "*****";

const Email = function (user) {
    this.firstName = user.firstName;
    this.email = user.email;
    this.recovery_key = user.recovery_key;
};


/*
We receive an Email object with the user provided data 
We then use the get function of Secret to retrieve the payload associated with the GMAIL_PASS key 
*/
Email.sendEmail = async (Email, result) => {
    var gmailPassword;
    await Secret.get(gmailPassSecret, (error, result) => {
        gmailPassword = result;
    });
    /*We create a transport object (provided by nodemailer (nodejs)) and send the
     log-in info of our email(this is where the thank you for registering email is sent from) 
    */
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || GMAIL_LOCAL_USER,
            pass: gmailPassword || GMAIL_LOCAL_PASS
        }
    });
    /*
    Set the mail options using data received as the function parameter, set subject and create the email body
    */
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
    /*
    Use the Transporter object created above and use the sendMail function to send the email to the adress provided by the user
    */
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//Make the class "public" for everyone who needs it
module.exports = Email;