var nodemailer = require('nodemailer');



const Email = function(user) {
    this.firstName = user.firstName;
    this.email = user.email;
    this.recovery_key=user.recovery_key;
};

Email.sendEmail = (Email, result) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.gmailUser || "flmrcn@gmail.com",
            pass: process.env.gmailPassword || "passwordsegura!"
        }
    });

    var mailOptions = {
        from: process.env.gmailUser,
        to: Email.email,
        subject: 'Welcome to DropFire',
        text: `Thank you ${Email.firstName} for registering in DropFire! \n 
    Here's your recovery key : ${Email.recovery_key} \n
    You will need this key to change your password. Keep it safe \n
    Best Regards,\n\n
    The DropFire team.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = Email;