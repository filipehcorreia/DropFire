var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var User = require("../model/user.js")
var router = express.Router();


router.use(bodyParser.urlencoded({ extended: true })); 
router.use('/views', express.static('views'));

router.get('/', function(req, res){
   res.render('register',{layout: false});
});



router.post('/', function(req, res){
  console.log(req.body);
  const { username, firstName, email, password, confirmPassword } = req.body;
  var response = {"error": [], "success": []};
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
      if (errFindUsername){
        console.log(errFindUsername);
      } 
      
      if (dataFindUsername === 0){

        User.findWhereEmail(email, (errFindEmail, dataFindEmail) => {
          if (errFindEmail) console.log(errFindEmail);

          if (dataFindEmail === 0){
            User.create(user, (errUserCreate, dataUserCreate) => {
              if (errUserCreate){
                console.log(errUserCreate);
              } 
              else{
                response["success"].push({"message": "User created!"});
                res.json(response);
              }
          });
          }else{
            response["error"].push({"message": "Email taken"});
            res.json(response);
          }
        });


      }else{
        response["error"].push({"message": "Username taken"});
        res.json(response);
      };
      
    });
  }else{
    response["error"].push({"message": "Passwords do not match"});
    res.json(response);
  }

});
 


//export this router to use in our index.js
module.exports = router;