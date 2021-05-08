//require everything to make this work
var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var User = require("../model/user.js")
var router = express.Router();
var Email = require("../model/email.js");

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use('/views', express.static('views'));

router.get('/', function (req, res) {
    res.render('register', {
        layout: false
    });
});

router.post('/', function (req, res) {
    const {
        username,
        firstName,
        email,
        password,
        confirmPassword
    } = req.body;
    var response = {
        "error": [],
        "success": []
    };
    // Check if the password and confirm password fields match
    var HashedPassword = crypto.createHash('sha256').update(password).digest('base64');
    var HashedKey = crypto.createHash('sha256').update(email).digest('base64');

    //If the passwords match, create the user object 
    if (password === confirmPassword) {
        const user = new User({
            username: username,
            firstName: firstName,
            email: email,
            password: HashedPassword,
            confirmPassword: confirmPassword,
            recovery_key: HashedKey
        });
        //After creating the user object, we check if there's a user registered with that username already. 
        User.findWhereUsername(username, (errFindUsername, dataFindUsername) => {
            if (errFindUsername) {
                console.log(errFindUsername);
            }
            //If that username isnt in use run the same process but for the email field.
            if (dataFindUsername === 0) {

                User.findWhereEmail(email, (errFindEmail, dataFindEmail) => {
                    if (errFindEmail) console.log(errFindEmail);
                    //if the email isnt in use we can create the account on the database
                    if (dataFindEmail === 0) {
                        User.create(user, (errUserCreate, dataUserCreate) => {
                            if (errUserCreate) {
                                console.log(errUserCreate);
                            } else {
                                //If the user is sucessfully created in the DB then create that user's bucket on Google Cloud Platform
                                User.createBucketOnGCP(user, (errCreateBucket, resBucket) => {
                                    console.log("Creating bucket")
                                    if (errCreateBucket) {
                                        console.log(errCreateBucket);
                                    } else {
                                        console.log("Bucket created");
                                    }
                                });
                                /*If everything the user is sucessfully created send the user's
                                change password key to the email provided by them and redirect to the LogIn page.
                                */
                                const email = new Email(user);
                                Email.sendEmail(email);
                                res.redirect('/auth/login');

                            }
                        });
                        //If the email is already taken render the page and with the EmailTaken attribute (to render the error box)    
                    } else {
                        res.render('register', {
                            layout: false,
                            EmailTaken: true
                        })
                    }
                });
                //If the username is already taken, render the page with UsernameTaken attribute to render the error box.
            } else {
                res.render('register', {
                    layout: false,
                    UsernameTaken: true
                })

            };

        });
    //If the passwords doesn't match, render the page with passwordsDontMatch attribute to render the error box.    
    } else {
        res.render('register', {
            layout: false,
            passwordsDontMatch: true
        })
    }

});

//export this router to use in our index.js
module.exports = router;