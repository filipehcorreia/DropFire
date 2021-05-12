//require everything to make this work

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const session = require('express-session');
var bodyParser = require('body-parser');
var User = require("../model/user.js")

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use('/views', express.static('views'));

router.get('/', function (req, res) {
    //Renders the login page
    res.render('login', {
        layout: false
    });
});

router.post('/', function (req, res) {
    const {
        username,
        password
    } = req.body;
    // Check if the password and confirm password fields match
    var HashedPassword = crypto.createHash('sha256').update(password).digest('base64');

    //Creates a new user object
    const user = new User({
        username: username,
        password: HashedPassword
    });

    //Trying to login with the credentials
    User.tryLogin(user, (errFindUsername, dataFindUsername) => {

        //If the login is not successfull, return the errors 
        if (errFindUsername) {
            console.log(errFindUsername);
        }

        //if some info got returned from the DB, creates the sessions and sets the session username and password for the values 
        //that camed from the database
        if (dataFindUsername.length == 1) {
            var sess = req.session;
            sess.username = user.username;
            sess.password = user.password;

          
            res.redirect("/");
            return;
        }

        //if the data returned from the database is 0, renders the login page again, 
        //and shows a InvalidCredentials error message on the screen
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