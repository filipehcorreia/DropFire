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
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use('/views', express.static('views'));

router.get('/', function(req, res) {
        if (req.session.username) {


            //merdas para processar o que vem da  veem para aqui?

            File.findWhereBucketUser(req.session.username, (errorFromFile, dataFromFile) => {
                if (errorFromFile) console.log(errorFromCreateFile);

                for (var i = 0; i < dataFromFile.size; i++) {
                    console.log(dataFromFile[i]);
                }
            });

            res.render('dashboard', {
                layout: false,
                files: dataFromFile
            });
        }    
        else {
            res.redirect("/auth/login");
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
    var projectName = 'genuine-plating-311210';

    var bucket = bucket_controller.bucket(`${projectName}${usernameFromSession}`);

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        //res.status(200).send(publicUrl);
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

        res.render('dashboard', {
            layout: false,
            fileUploaded: true
        });
    })



});

module.exports = router;