const db_controller = require("./mysql_controller");

const CREATE_TABLE_USERS_STATMENT = "CREATE TABLE users (username VARCHAR(20) PRIMARY KEY,firstname VARCHAR(30),email VARCHAR(65),password VARCHAR(512))";

db_controller.getConnection(function(err, connection) {
    if (err) throw err; //Could't get connection from the pool
   
    connection.query(CREATE_TABLE_USERS_STATMENT, function (error) {
      if (error) throw error;
    });

    

    connection.release();
   
  });
