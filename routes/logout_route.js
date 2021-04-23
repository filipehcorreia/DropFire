var express = require('express');
var router = express.Router();
const session = require('express-session');

router.use('/views', express.static('views'));

router.get('/', function(req, res){
    req.session.cookie.maxAge = new Date(Number(Date.now()) - 100000000000000000)
    
    req.session.destroy(function(err) {
        
        res.redirect('/');
    })

});


//export this router to use in our index.js
module.exports = router;