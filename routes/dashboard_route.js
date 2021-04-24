var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();


router.use(bodyParser.urlencoded({
    extended: true
}));

router.use('/views', express.static('views'));

router.get('/', function(req, res) {

    //TODO SE TIVER AUTENTICADO PODE IR
    res.render('dashboard', {
        layout: false
    });
});

module.exports = router;