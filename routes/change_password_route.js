//require everything to make this work

var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var User = require("../model/user.js")
var router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use('/views', express.static('views'));

router.get('/', function (req, res) {
    res.render('change_pass', {
        layout: false
    });
});

router.post('/', function (req, res) {
    const {
        email,
        key,
        password,
        confirmPassword
    } = req.body;
    var response = {
        "error": [],
        "success": []
    };

    var HashedPassword = crypto.createHash('sha256').update(password).digest('base64');
    // Check if the password and confirm password fields match
    //If the password matches, create a user object with data provided by the user
    if (password === confirmPassword) {
        const user = new User({
            email: email,
            password: HashedPassword,
            confirmPassword: confirmPassword
        });

        //Check if the 'change password' key provided by the user matches the key in the db
        User.checkIfKeyMatches(email, key, (errMatchKey, dataMatchKey) => {
            if (errMatchKey) {
                console.log(errMatchKey);
            }
            //If it matches, then we use the updatePassword function to change the account's password (on the db)
            if (dataMatchKey !== 0) {
                User.updatePassword(user.password, email, (errUpdate, dataUpdate) => {
                    if (errUpdate) {
                        console.log(errUpdate);
                    }
                    //If sucessfull redirect to login page
                    res.redirect("/auth/login")
                });
                /*If the key provided by the user doesnt match the key in the db 
                set keyDoesntMatch atributte to later render an error message
                */
            } else {
                res.render('change_pass', {
                    layout: false,
                    keyDoesntMatch: true
                })
            }
        });
        /*If the 'password' and 'confirmPassword' fields dont match 
        set keyDoesntMatch atributte to later render an error message
        */
    } else {
        res.render('change_pass', {
            layout: false,
            passwordsDontMatch: true
        })
    }

});

//export this router to use in our index.js
module.exports = router;