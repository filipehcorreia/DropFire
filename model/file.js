const db_controller = require('../controllers/mysql_controller.js');
var dateFormat = require('dateformat');

const CREATE_FILES_STATEMENT = 'INSERT INTO files VALUES (?,?,?,?)'; //FileName, FileSize, UploadDate, Bucket_user
const FIND_FILES_STATEMENT = 'SELECT * FROM files WHERE bucket_user=(?)';

// constructor
const File = function(file) {
    this.filename = file.filename;
    this.filesize = file.filesize;
    this.uploaddate = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    this.bucketuser = file.bucketuser;
};

File.create = async(fileToCreate, result) => {
    db_controller.getConnection(function(err, connection) {
        if (err) throw err; //Error connection to 

        connection.query(CREATE_FILES_STATEMENT, [fileToCreate.filename, fileToCreate.filename, fileToCreate.uploaddate, fileToCreate.bucketuser], function(err, res) {
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

            console.log(res);
            //Found 0 occasions
            result(null, 0);

        });
    });
};

File.findWhereBucketUser = (bucket_userToSearch, result) => {
    db_controller.getConnection(function(errConnection, connection) {
        if (errConnection) throw errConnection;

        connection.query(FIND_FILES_STATEMENT, [bucket_userToSearch], function(errFromDb, resFromDB) {
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

module.exports = File;