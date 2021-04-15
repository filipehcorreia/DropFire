const mysql = require("mysql");

const SCHEMA_CREATE_STATEMENT = "CREATE DATABASE IF NOT EXISTS";

var db_name = process.env.DB_NAME || "tumate3";
var cloud = process.env.IS_CLOUD

  if(cloud == undefined){
    var tempPool = mysql.createPool({
      host: process.env.DB_HOST || '104.197.36.137',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || ""
    });
  }else{
    const tempPool = mysql.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    });
  }


  //Create the shecma provided if there is not one
  tempPool.getConnection(function(err, connection) {
    if (err) throw err; // Couldn't get connection from pool

    connection.query(`${SCHEMA_CREATE_STATEMENT} ${db_name}`, function (err, res) {
      if (res.warningCount != 1 ){ //It will not give a warning if there isn't one schema created whit the name choosen'
        require("./mysql_creator");//Therefore it needs to create the tables
      }else{
        console.log("Schema was already created")
      }
      //Give connection back to the pool
      connection.release();
    });
  });

  //Reconnect since we are using a pool, and the select DB is not possible
  const pool = mysql.createPool({
    host: '104.197.36.137',
    port: 3306,
    user: "root",
    password: "luis969696",
    database: db_name

  });
  
  //give the pool to whomever ask for it
  module.exports = pool;