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
    res.render('register', {
        layout: false
    });
});



router.post('/', function(req, res) {
    console.log(req.body);
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

    if (password === confirmPassword) {
        const user = new User({
            username: username,
            firstName: firstName,
            email: email,
            password: HashedPassword,
            confirmPassword: confirmPassword
        });

        User.findWhereUsername(username, (errFindUsername, dataFindUsername) => {
            if (errFindUsername) {
                console.log(errFindUsername);
            }

            if (dataFindUsername === 0) {

                User.findWhereEmail(email, (errFindEmail, dataFindEmail) => {
                    if (errFindEmail) console.log(errFindEmail);

                    if (dataFindEmail === 0) {
                        User.create(user, (errUserCreate, dataUserCreate) => {
                            if (errUserCreate) {
                                console.log(errUserCreate);
                            } else {
                                res.redirect('/auth/login');
                            }
                        });
                    } else {
                        res.render('register', {
                            layout: false,
                            EmailTaken: true
                        })
                    }
                });

            } else {
                res.render('register', {
                    layout: false,
                    UsernameTaken: true
                })

            };

        });
    } else {
        res.render('register', {
            layout: false,
            passwordsDontMatch: true
        })
    }

});



//export this router to use in our index.js
module.exports = router;