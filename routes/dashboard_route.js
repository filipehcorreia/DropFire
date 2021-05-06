var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var { format } = require('util');
var Multer = require('multer');
var bucket_controller = require('./../controllers/bucket_controller.js');
var File = require('./../model/file.js');
var dateFormat = require('dateformat');

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1024 * 3, // no larger than 1gb, you can change as needed.
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

            for (var i = 0; i < dataFromFile.length; i++) {
                var day = dataFromFile[i].UploadDate.substr(0,10);
                var date = dataFromFile[i].UploadDate.substr(10,dataFromFile[i].UploadDate.length);
                arr.push({
                    filename: dataFromFile[i].FileName.substring(18,dataFromFile[i].FileName.length),
                    filesize: (dataFromFile[i].FileSize * 0.000001).toFixed(2) + "MB",
                    uploaddate: day + " " + date
                });
            }

            /*THIS RENDER HAS TO BE INSIDE THE FUNCTION WHERE THE SQL QUERIE HAPPENS , OTHERWISE
            THE QUERIE RESULT WILL ARRIVE AFTER THE "FILES(null)"
            ARE SENT TO THE HANDLEBARS TO RENDER*/

            switch(req.query.msg) {
                case "notDeleted":
                    msgE = "The file was not deleted";
                    msgS = undefined
                    break;
                case "fileDeleted":
                    msgS = "The file was deleted";
                    msgE= undefined
                    break;
                case "fileUploaded":
                    msgS = "The file was uploaded!"
                    msgE = undefined
                    break;
                case "fileNotUploaded":
                    msgS = undefined
                    msgE = "Error, file wasn't uploaded"
                    break;
                case "fileNotSelected":
                    msgS = undefined
                    msgE = "Error, file wasn't selected"
                    break;
                case "fileTooLarge":
                    msgS = undefined
                    msgE = "Error, file is too big"
                    break;
                    }
            
            if (req.query.msg) {
                res.render('dashboard', {
                    layout: false,
                    msgS: msgS,
                    msgE: msgE,
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
    
    if (!req.file) {
        res.redirect('/dashboard?msg=fileNotSelected');
        return;
    }
    
    var usernameFromSession = req.session.username.toLowerCase();
    var fixedNameOfBucket = 'flmrcn';

    var bucket = bucket_controller.bucket(`${fixedNameOfBucket}${usernameFromSession}`);
    var uploaddate = dateFormat(new Date(), "yyyy-mm-ddhh:MM:ss");
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(uploaddate+req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        //res.redirect('/dashboard?msg=fileNotUploaded');
        next(err);
    });

    blobStream.on('finish', () => {
        res.status(200).redirect("/dashboard");
    });

    blobStream.end(req.file.buffer);

    const file = new File({
        filename: req.file.originalname,
        filesize: req.file.size,
        bucketuser: usernameFromSession,
        uploaddate: uploaddate
    });


    File.create(file, (errorFromCreateFile, dataFromCreateFile) => {
        if (errorFromCreateFile) console.log(errorFromCreateFile);

        res.redirect('/dashboard?msg=fileUploaded');
    })
    
}


});

router.get('/download/:filename', async function(req, res) {

    if(req.session.username){
        var filename = req.params.filename;
        var usernameFromSession = req.session.username.toLowerCase();
        var fixedNameOfBucket = 'flmrcn';
    
        try{
            var bucket = bucket_controller.bucket(`${fixedNameOfBucket}${usernameFromSession}`);
            const remoteFile = bucket.file(filename);
            
            await remoteFile.getMetadata().then(function(metaDataResponse){
                res.set("Content-Type", metaDataResponse.contentType);
                res.attachment(filename.substr(18,filename.length));
            });

            remoteFile.createReadStream()
                .on('error', function(err) {
                    console.log(err)
                })
                .on('response', function(response) {
                    // Server connected and responded with the specified status and headers.
                })
                .on('end', function() {
                    // The file is fully downloaded.
                })
                .pipe(res);
        }catch(err){
            console.log(err);
            
        }
        

    }else{
        res.redirect("/auth/login");
    }


});

router.get('/delete/:filename', async function(req, res) {

    if(req.session.username){
        var filename = req.params.filename;
        var usernameFromSession = req.session.username.toLowerCase();
        var fixedNameOfBucket = 'flmrcn';
    
        try{
            var bucket = bucket_controller.bucket(`${fixedNameOfBucket}${usernameFromSession}`);
            const remoteFile = bucket.file(filename);
            
            await remoteFile.delete();         
            //apagar na DB
            File.deleteFile(filename, (errorFromCreateFile, dataFromDeleteFile) => {
                if (errorFromCreateFile) console.log(errorFromCreateFile);
                res.redirect('/dashboard?msg=fileDeleted');
            })

        }catch(err){
            console.log(err);
            
        }
        

    }else{
        res.redirect("/dashboard?msg=notDeleted");
    }

    

});

module.exports = router;