//require everything to make this work

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var {
    format
} = require('util');
var Multer = require('multer');
var bucket_controller = require('./../controllers/bucket_controller.js');
var File = require('./../model/file.js');
var dateFormat = require('dateformat');

//Settings for the file uploader

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1024 * 3, // no larger than 3gb, you can change as needed.
    },
});

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use('/views', express.static('views'));

//Handle the dashboard -> Show user's files.
router.get('/', function (req, res) {

    var arr = [];
    if (req.session.username) {
        //Use the username in the session to retrieve the user's files information from the DB
        File.findWhereBucketUser(req.session.username, (errorFromFile, dataFromFile) => {

            if (errorFromFile) console.log(errorFromCreateFile);
            //Cycle through the results and store them to list on the dashboard table.
            for (var i = 0; i < dataFromFile.length; i++) {
                var day = dataFromFile[i].UploadDate.substr(0, 10);
                var date = dataFromFile[i].UploadDate.substr(10, dataFromFile[i].UploadDate.length);
                arr.push({
                    filename: dataFromFile[i].FileName.substring(18, dataFromFile[i].FileName.length),
                    filesize: (dataFromFile[i].FileSize * 0.000001).toFixed(2) + "MB",
                    uploaddateDisplay: day + " " + date,
                    uploaddate: day + date
                });
            }

            /*THIS RENDER HAS TO BE INSIDE THE FUNCTION WHERE THE SQL QUERY HAPPENS , OTHERWISE
            THE QUERIE RESULT WILL ARRIVE AFTER THE "FILES(null/empty)"
            ARE SENT TO THE HANDLEBARS TO RENDER*/


            //Handle the different outcomes (sucess/errors) to render the respective alerts
            switch (req.query.msg) {
                case "notDeleted":
                    msgE = "The file was not deleted";
                    msgS = undefined
                    break;
                case "fileDeleted":
                    msgS = "The file was deleted";
                    msgE = undefined
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
            /*If data is retrieved, send file's data and 
            error/sucess messages to the headers in order to re-render the dashboard
            */
            if (req.query.msg) {
                res.render('dashboard', {
                    layout: false,
                    msgS: msgS,
                    msgE: msgE,
                    arr: arr

                });
                /*If there's no data retrieved dont send anything 
                (should happen if the user doesnt have any files uploaded|| There's no files in the database that belongs to <user>)    
                */
            } else {
                res.render('dashboard', {
                    layout: false,
                    arr: arr
                });
            }

        });
        //If there's no username in the session's cookie (user isnt logged in) redirect to home page
    } else {
        res.redirect("/");
    }
});

//Handle the file uploading process
router.post('/upload', multer.single('file'), function (req, res, next) {
    //Check if there's a logged user
    if (req.session.username) {
        //Check if the user selected a file.
        if (!req.file) {
            res.redirect('/dashboard?msg=fileNotSelected');
            return;
        }
        /*Structure the bucket's name. Since bucket names have to be unique and have all-lowercase chars we
        use our initials "flmrcn" and the user's username (formatted to lowercase) to genereate an unique bucket name
        */
        var usernameFromSession = req.session.username.toLowerCase();
        var fixedNameOfBucket = 'flmrcn';

        //Create the user's bucket using the data stated above 
        var bucket = bucket_controller.bucket(`${fixedNameOfBucket}${usernameFromSession}`);
        var uploaddate = dateFormat(new Date(), "yyyy-mm-ddhh:MM:ss");

        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(uploaddate + req.file.originalname);
        const blobStream = blob.createWriteStream();
        //If there's an error (the file isnt upload)
        blobStream.on('error', err => {
            //res.redirect('/dashboard?msg=fileNotUploaded');
            next(err);
        });
        //When the file is done uploading , redirect to the dashboard forcing the update (new files will be rendered in the table)
        blobStream.on('finish', () => {
            res.status(200).redirect("/dashboard");
        });

        blobStream.end(req.file.buffer);

        //Create the file object
        const file = new File({
            filename: req.file.originalname,
            filesize: req.file.size,
            bucketuser: usernameFromSession,
            uploaddate: uploaddate
        });
        //Register file in db
        //If the file is sucessfuly created in the db render a sucess message.
        File.create(file, (errorFromCreateFile, dataFromCreateFile) => {
            if (errorFromCreateFile) console.log(errorFromCreateFile);

            res.redirect('/dashboard?msg=fileUploaded');
        })

    }

});

//Handle file downloading
router.get('/download/:filename', async function (req, res) {
    //If the user is logged, save the file name , format the logged user's username to acess the bucket (initials+lowercase username)
    if (req.session.username) {
        var filename = req.params.filename;
        var usernameFromSession = req.session.username.toLowerCase();
        var fixedNameOfBucket = 'flmrcn';
        //Try to download the file from the bucket
        try {
            var bucket = bucket_controller.bucket(`${fixedNameOfBucket}${usernameFromSession}`);

            const remoteFile = bucket.file(filename);
            //Get file's metadata and give with the following headers
            await remoteFile.getMetadata().then(function (metaDataResponse) {
                res.set("Content-Type", metaDataResponse.contentType);

                /*We format the file name(adding date/time as a prefix) when writing to the db.
                We have to take out the date/time prefix
                */

                res.attachment(filename.substr(18, filename.length));
            });

            remoteFile.createReadStream()
                .on('error', function (err) {
                    console.log(err)
                })
                .on('response', function (response) {
                    // Server connected and responded with the specified status and headers.
                })
                .on('end', function () {
                    // The file is fully downloaded.
                })
                .pipe(res);
        } catch (err) {
            //If the download was not succesfully done, return the errors, and shows an error message on the page.
            console.log(err);
            res.redirect("/dashboard?msg=fileNotUploaded");
        }

        //If the user is not logged in and tries to access the dashboard, he will be redirected to the login form.     
    } else {
        res.redirect("/auth/login");
    }


});

//Delete a file from a certain bucket
router.get('/delete/:filename', async function (req, res) {
    //If the user is logged, save the file name , format the logged user's username to acess the bucket (initials+lowercase username)
    if (req.session.username) {
        var filename = req.params.filename;
        var usernameFromSession = req.session.username.toLowerCase();
        var fixedNameOfBucket = 'flmrcn';

        //Tries to delete the file from the bucket
        try {
            var bucket = bucket_controller.bucket(`${fixedNameOfBucket}${usernameFromSession}`);
            const remoteFile = bucket.file(filename);

            await remoteFile.delete();
            //Delete file in db
            //If the file is sucessfuly deleted in the db render a sucess message.
            File.deleteFile(filename, (errorFromCreateFile, dataFromDeleteFile) => {
                if (errorFromCreateFile) console.log(errorFromCreateFile);
                res.redirect('/dashboard?msg=fileDeleted');
            })

        } catch (err) {
            //If somethign wrong happens, return the errors
            console.log(err);

        }
        //If the file isnt deleted show error message
    } else {
        res.redirect("/dashboard?msg=notDeleted");
    }

});

module.exports = router;