//require everything to make this work

const db_controller = require('../controllers/mysql_controller.js');
var dateFormat = require('dateformat');

//SQL Queries to insert files, find files for a certain bucket and delete fileste 
const CREATE_FILES_STATEMENT = 'INSERT INTO files VALUES (?,?,?,?)'; //FileName, FileSize, UploadDate, Bucket_user
const FIND_FILES_STATEMENT = 'SELECT * FROM files WHERE bucket_user=(?)';
const DELETE_FILES_STATEMENT = 'DELETE FROM files WHERE FileName=(?)';

// constructor
const File = function (file) {
    this.filesize = file.filesize;
    this.uploaddate = file.uploaddate;
    this.filename = file.uploaddate + file.filename;
    this.bucketuser = file.bucketuser;
};
/*
We store file information in the database so can later use it to fill the user's dashboard with their files
*/
File.create = async (fileToCreate, result) => {
    db_controller.getConnection(function (err, connection) {
        if (err) throw err; //Error connection to 

        connection.query(CREATE_FILES_STATEMENT, [fileToCreate.filename, fileToCreate.filesize, fileToCreate.uploaddate, fileToCreate.bucketuser], function (err, res) {
            // When done with the connection, release it.
            connection.release();
            //Error from DB     
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            //Return found
            if (res.length) {
                result(null, res);
                return;
            }
            //Found 0 occasions
            result(null, 0);
        });
    });
};
/*
Get the files information from the database using the username of the logged user to display on their dashboard.
*/

File.findWhereBucketUser = (bucket_userToSearch, result) => {
    db_controller.getConnection(function (errConnection, connection) {
        if (errConnection) throw errConnection;

        connection.query(FIND_FILES_STATEMENT, [bucket_userToSearch], function (errFromDb, resFromDB) {
            // When done with the connection, release it.
            connection.release();

            //Error from DB
            if (errFromDb) {
                console.log("error: ", errFromDb);
                result(errFromDb, null);
                return;
            }

            //Return found
            if (resFromDB.length) {
                result(null, resFromDB);
                return resFromDB;
            }

            //Find 0 occasions
            result(null, 0);

        });
    });
};


/*
Delete the files from the database using the file name
*/

File.deleteFile = (fileNameToDelete, result) => {
    db_controller.getConnection(function (errConnection, connection) {
        if (errConnection) throw errConnection;

        connection.query(DELETE_FILES_STATEMENT, [fileNameToDelete], function (errFromDb, resFromDB) {
            // When done with the connection, release it.
            connection.release();

            //Error from DB
            if (errFromDb) {
                console.log("error: ", errFromDb);
                result(errFromDb, null);
                return;
            }

            //Return found
            if (resFromDB.length) {
                result(null, resFromDB);
                return resFromDB;
            }

            //Find 0 occasions
            result(null, 0);

        });
    });
};

//Make the class "public" for everyone who needs it
module.exports = File;