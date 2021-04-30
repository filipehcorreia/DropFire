var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var { format } = require('util');
var Multer = require('multer');
var bucket_controller = require('./../controllers/bucket_controller.js');
var File = require('./../model/file.js');

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1024, // no larger than 1gb, you can change as needed.
    },
});

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use('/views', express.static('views'));

router.get('/', function(req, res) {

    var arr = [];
    if (req.session.username) {

        File.findWhereBucketUser(req.session.username, (errorFromFile, dataFromFile) => {

            if (errorFromFile) console.log(errorFromCreateFile);

            console.log(dataFromFile.length);
            for (var i = 0; i < dataFromFile.length; i++) {
                arr.push({
                    filename: dataFromFile[i].FileName.substring((dataFromFile[i].FileName.indexOf("*") + 1), dataFromFile[i].FileName.length),
                    filesize: (dataFromFile[i].FileSize * 0.000001).toFixed(2) + "MB",
                    uploaddate: dataFromFile[i].UploadDate
                });
            }

            /*THIS RENDER HAS TO BE INSIDE THE FUNCTION WHERE THE SQL QUERIE HAPPENS , OTHERWISE
            THE QUERIE RESULT WILL ARRIVE AFTER THE "FILES(null)"
            ARE SENT TO THE HANDLEBARS TO RENDER*/
            if (req.query.msg) {
                res.render('dashboard', {
                    layout: false,
                    fileUploaded: `The file was uploaded!`,
                    arr: arr

                });
            } else {
                res.render('dashboard', {
                    layout: false,
                    arr: arr
                });
            }




        });

    } else {
        res.redirect("/");
    }
});

router.post('/upload', multer.single('file'), function(req, res, next) {

    if (req.session.username) {
        console.log("authed")
    }

    if (!req.file) {
        res.render('dashboard', {
            layout: false,
            errorSelectFile: "No file was selected!"
        });
        return;
    }

    var usernameFromSession = req.session.username;
    var fixedNameOfBcuket = 'flmrcn';

    console.log(`${fixedNameOfBcuket}${usernameFromSession}`);
    var bucket = bucket_controller.bucket(`${fixedNameOfBcuket}${usernameFromSession}`);

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', () => {
        res.status(200).redirect("/dashboard");
    });

    blobStream.end(req.file.buffer);

    const file = new File({
        filename: req.file.originalname,
        filesize: req.file.size,
        bucketuser: usernameFromSession
    });


    File.create(file, (errorFromCreateFile, dataFromCreateFile) => {
        if (errorFromCreateFile) console.log(errorFromCreateFile);

        /*res.render('dashboard', {
            layout: false,
            fileUploaded: `The file ${req.file.originalname} was uploaded!`
        });*/
        res.redirect('/dashboard?msg=success')
    })



});

module.exports = router;