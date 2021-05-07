//Imports and requires that we will need
const mysql = require("mysql");
const Mysql_tables = require("./mysql_tables.js");

//Consts that will create the schema and a simple query to get alll the files from a bucket with a certain user
const SCHEMA_CREATE_STATEMENT = "CREATE DATABASE IF NOT EXISTS";
const GET_USER_FILES_STATEMENT = 'SELECT * FROM files WHERE bucket_user= (?)';

//Name of the database. If we are on cloud it will use the environment variable. Else, will use the name
var db_name = process.env.DB_NAME || "main";

//Know if we are on lcoud or not. Default value of IS_CLOUD is true.
var cloud = process.env.IS_CLOUD

if (cloud == undefined) {
    //Creating the connection
    //If working locally, it will use host, port, user and password values. 
    //Like we did on db_name variable, we saved this sensitive valuies on environment values
    //Although if we want to use it only on the local computer we need the values on the right.
    var tempConnection = mysql.createConnection({
        host: process.env.DB_HOST || "146.148.24.140",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "cloud_run_user",
        password: process.env.DB_PASS || "passwordsegura!"
    });
} else {
    console.log("Creating connection on cloud");
    //If on cloud, we dont need the value of the host and port, only yhe user, password and the socketPath
    //socketPath is the "tunnel" between the code and the Cloud SQL.
    var tempConnection = mysql.createConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    });
}
//Tries to create the schema with the specified name on db_name variable
tempConnection.query(`${SCHEMA_CREATE_STATEMENT} ${db_name}`, function (err, res) {
    //If an error occurs, send an error
    if (err) throw err;

    //It will not give a warning if there isn't one schema created whit the name chosen'
    if (res.warningCount != 1) {
        //require("./mysql_creator");//Therefore it needs to create the tables
        var tables = new Mysql_tables({
            connection: tempConnection,
            db_name: db_name
        });

        //Create the tables
        Mysql_tables.create(tables);

    } else {
        //If the schema already exists, it doesnt need to be created again
        console.log("Schema was already created")
    }
    //TODO If there is already a schema with the name , check if there tables are well formed
    //Close connection
    tempConnection.end();
});

//Creating the pool only happens after the connection has been succesfully established and tables and schema creation.
//Like the createConnection, if working locally, it will use host, port, user and password values. 
//Like we did on db_name variable, we saved this sensitive valuies on environment values
//Although if we want to use it only on the local computer we need the values on the right.
if (cloud == undefined) {
    var pool = mysql.createPool({
        host: process.env.DB_HOST || '146.148.24.140',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "cloud_run_user",
        password: process.env.DB_PASS || "passwordsegura!",
        database: db_name
    });
} else {
    console.log("Creating pool on cloud");
    //Reconnect since we are using a pool, and the select DB is not possible
    //If on cloud, we dont need the value of the host and port, only yhe user, password and the socketPath
    //socketPath is the "tunnel" between the code and the Cloud SQL. 
    var pool = mysql.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: db_name,
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    });

}

//give the pool to whomever ask for it
module.exports = pool;