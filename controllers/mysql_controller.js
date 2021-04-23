const mysql = require("mysql");
const Mysql_tables = require("./mysql_tables.js");

const SCHEMA_CREATE_STATEMENT = "CREATE DATABASE IF NOT EXISTS";

var db_name = process.env.DB_NAME || "main";
var cloud = process.env.IS_CLOUD

  if(cloud == undefined){
    var tempConnection = mysql.createConnection({
      host: process.env.DB_HOST || "146.148.24.140",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "cloud_run_user",
      password: process.env.DB_PASS || "passwordsegura!"
    });
  }else{
    console.log("Creating connection on cloud");
    var tempConnection = mysql.createConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    });
  }


tempConnection.query(`${SCHEMA_CREATE_STATEMENT} ${db_name}`, function (err, res) {
  if (err) throw err;
      if (res.warningCount != 1 ){ //It will not give a warning if there isn't one schema created whit the name chosen'
        //require("./mysql_creator");//Therefore it needs to create the tables
        var tables  = new Mysql_tables({
            connection: tempConnection,
            db_name: db_name
          });

        Mysql_tables.create(tables);

      }else{
        console.log("Schema was already created")
      }
      //TODO If there is already a schema with the name , check if there tables are well formed
      //Close connection
  tempConnection.end();
    });



if(cloud == undefined) {
  var pool = mysql.createPool({
   host: process.env.DB_HOST || '146.148.24.140',
   port: process.env.DB_PORT || 3306,
   user: process.env.DB_USER || "cloud_run_user",
   password: process.env.DB_PASS || "passwordsegura!",
   database: db_name
 });
}else {
  console.log("Creating pool on cloud");
  //Reconnect since we are using a pool, and the select DB is not possible
  var pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: db_name,
    socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
  });

}

  
  //give the pool to whomever ask for it
  module.exports = pool;
