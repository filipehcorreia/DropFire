var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const session = require('express-session');
var bodyParser = require('body-parser');
var User = require("../model/user.js")

router.use(bodyParser.urlencoded({ extended: true }));
router.use('/views', express.static('views'));

router.get('/', function(req, res) {
    res.render('login', { layout: false });
});

router.post('/', function(req, res) {
    const { username, password } = req.body;
    // Check if the password and confirm password fields match
    var HashedPassword = crypto.createHash('sha256').update(password).digest('base64');

    var response = { "error": [], "success": [] };

    const user = new User({
        username: username,
        password: HashedPassword
    });

    User.tryLogin(user, (errFindUsername, dataFindUsername) => {

        if (errFindUsername) {
            console.log(errFindUsername);
        }


        if (dataFindUsername.length == 1) {
            var sess = req.session;
            sess.username = user.username;
            sess.password = user.password;

            response["success"].push({ "msg": "You are now logged in!" });
            res.redirect("/");
            return;
        }

        if (dataFindUsername == 0) {
            res.render('login', {
                layout: false,
                InvalidCredentials: true
            })
            return;
        }


    });

});

//export this router to use in our index.js
module.exports = router;