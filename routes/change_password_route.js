var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var User = require("../model/user.js")
var router = express.Router();


router.use(bodyParser.urlencoded({
    extended: true
}));
router.use('/views', express.static('views'));

router.get('/', function(req, res) {
    res.render('change_pass', {
        layout: false
    });
});



router.post('/', function(req, res) {
    console.log(req.body);
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
    // Check if the password and confirm password fields match
    var HashedPassword = crypto.createHash('sha256').update(password).digest('base64');

    if (password === confirmPassword) {
        const user = new User({
            email: email,
            password: HashedPassword,
            confirmPassword: confirmPassword
        });

        User.checkIfKeyMatches(email,key,(errMatchKey, dataMatchKey) => {
            if (errMatchKey) {
                console.log(errMatchKey);
            }

            if (dataMatchKey !==0){

                User.updatePassword(user.password,email,(errUpdate, dataUpdate) => {
                    if (errUpdate) {
                        console.log(errUpdate);
                    }

                    res.redirect("/auth/login")
                });
            }else {
                res.render('change_pass', {
                    layout: false,
                    keyDoesntMatch: true
                })
            }
        


        });


    }else {
        res.render('change_pass', {
            layout: false,
            passwordsDontMatch: true
        })
    }

});



//export this router to use in our index.js
module.exports = router;