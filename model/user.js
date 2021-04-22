const db_controller = require("../controllers/mysql_controller.js");

const CREATE_USER_STATEMENT = 'INSERT INTO users VALUES (?,?,?,?)';
const FIND_USER_BY_USERNAME_STATEMENT = 'SELECT * FROM users WHERE username=?';
const FIND_USER_BY_EMAIL_STATEMENT = 'SELECT * FROM users WHERE email=?';
const USER_LOGIN_STATEMENT = 'SELECT * FROM users WHERE username=? and password=?';
// constructor
const User = function(user) {
  this.username = user.username;
  this.firstName = user.firstName;
  this.email = user.email;
  this.password = user.password;
};

User.create = (userToCreate,result) => {
    db_controller.getConnection(function(err, connection) {
        if (err) throw err; //Error connection to 
       
        connection.query(CREATE_USER_STATEMENT,[userToCreate.username,userToCreate.firstName,userToCreate.email,userToCreate.password], function (err, res) {
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

    

User.findWhereUsername = (usernameToSearch, result) => {
  db_controller.getConnection(function(errConnection, connection) {
    if (errConnection) throw errConnection; 
   
    connection.query(FIND_USER_BY_USERNAME_STATEMENT,[usernameToSearch], function (errFromDb, resFromDB) {
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

User.findWhereEmail = (emailToSearch, result) => {
  db_controller.getConnection(function(err, connection) {
    if (err) throw err; 
   
    connection.query(FIND_USER_BY_EMAIL_STATEMENT,[emailToSearch], function (err, res) {
      // When done with the connection, release it.
      connection.release();
   
    //Error from DB
  
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(res.length);
    //Reeturn found
    if (res.length>=1) {
      result(null, res);
      return;
    }else{

    //Find 0 occasions
    result(null, 0);
    }

});
  });
};

User.tryLogin = (userToLogin, result) => {
  db_controller.getConnection(function(err, connection) {
    if (err) throw err; 
   
    connection.query(USER_LOGIN_STATEMENT,[userToLogin.username,userToLogin.password], function (err, res) {
      // When done with the connection, release it.
      connection.release();
   
    //Error from DB
  
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(res.length);
    //Reeturn found
    if (res.length>=1) {
      result(null, res);
      return;
    }else{

    //Find 0 occasions
    result(null, 0);
    }

});
  });
  
};




module.exports = User;