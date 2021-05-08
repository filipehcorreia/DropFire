//require everything to make this work

const db_controller = require("../controllers/mysql_controller.js");
const Bucket = require("./bucket.js");

//SQL queries to create user, find users by name and email, login, changePassword, to check if email and the recovery key matches 
const CREATE_USER_STATEMENT = 'INSERT INTO users VALUES (?,?,?,?,?)';
const FIND_USER_BY_USERNAME_STATEMENT = 'SELECT * FROM users WHERE username=?';
const FIND_USER_BY_EMAIL_STATEMENT = 'SELECT * FROM users WHERE email=?';
const USER_LOGIN_STATEMENT = 'SELECT * FROM users WHERE username=? and password=?';
const CHECK_IF_KEYS_MATCH_STATEMENT = 'SELECT * FROM users WHERE email=? and recovery_key=?';
const CHANGE_PASSWORD_STATEMENT = 'UPDATE users SET password=? WHERE email=?';

// constructor
const User = function (user) {
    this.username = user.username;
    this.firstName = user.firstName;
    this.email = user.email;
    this.password = user.password;
    this.recovery_key = user.recovery_key;
};

/* we create and insert a user in the database*/

User.create = (userToCreate, result) => {
    db_controller.getConnection(function (err, connection) {
        if (err) throw err; //Error connection to 

        connection.query(CREATE_USER_STATEMENT, [userToCreate.username, userToCreate.firstName, userToCreate.email, userToCreate.password, userToCreate.recovery_key], function (err, res) {
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
we create and insert a bucket in the database, with the name of the user plus the string "flmrcn"
*/

User.createBucketOnGCP = (userToCreate, result) => {

    const bucket = new Bucket({
        bucket_name: "flmrcn" + userToCreate.username.toLowerCase(),
        bucket_username: userToCreate.username
    });

    Bucket.create(bucket, (errBucket, resBucket) => {
        console.log("Creating bucket on user.js")
        if (errBucket) {
            console.log(errBucket);
        }

    });
};

/*
Select everything from the 'users' table associated with a specific username using a connection from the pool
*/

User.findWhereUsername = (usernameToSearch, result) => {
    db_controller.getConnection(function (errConnection, connection) {
        if (errConnection) throw errConnection;

        connection.query(FIND_USER_BY_USERNAME_STATEMENT, [usernameToSearch], function (errFromDb, resFromDB) {
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
                return;
            }

            //Find 0 occasions
            result(null, 0);

        });
    });
};

/*
Select everything from the 'users' table associated with a specific email address using a connection from the pool
*/

User.findWhereEmail = (emailToSearch, result) => {
    db_controller.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(FIND_USER_BY_EMAIL_STATEMENT, [emailToSearch], function (err, res) {
            // When done with the connection, release it.
            connection.release();

            //Error from DB
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            //Reeturn found
            if (res.length >= 1) {
                result(null, res);
                return;
            } else {

                //Find 0 occasions
                result(null, 0);
            }

        });
    });
};

//Check if the recovery key and email matches. We will need this to change the password. 
User.checkIfKeyMatches = (emailToSearch, keyToSearch, result) => {
    db_controller.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(CHECK_IF_KEYS_MATCH_STATEMENT, [emailToSearch, keyToSearch], function (err, res) {
            // When done with the connection, release it.
            connection.release();

            //Error from DB

            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            //Reeturn found
            if (res.length >= 1) {
                result(null, res);
                return;
            } else {

                //Find 0 occasions
                result(null, 0);
            }

        });
    });
};


//When the password have been changed, update the database data 

User.updatePassword = (password, emailToUpdate, result) => {
    db_controller.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(CHANGE_PASSWORD_STATEMENT, [password, emailToUpdate], function (err, res) {
            // When done with the connection, release it.
            connection.release();

            //Error from DB

            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            //Return found
            if (res.length >= 1) {
                result(null, res);
                return;
            } else {

                //Find 0 occasions
                result(null, 0);
            }

        });
    });
};

//tryLogin for the login form. Checks if the user and password are correct/ the pair exists on the DB.
User.tryLogin = (userToLogin, result) => {
    db_controller.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(USER_LOGIN_STATEMENT, [userToLogin.username, userToLogin.password], function (err, res) {
            // When done with the connection, release it.
            connection.release();

            //Error from DB

            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            //Return found
            if (res.length >= 1) {
                result(null, res);
                return;
            } else {

                //Find 0 occasions
                result(null, 0);
            }

        });
    });

};

//Make the class "public" for everyone who needs it
module.exports = User;