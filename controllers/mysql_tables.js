const Mysql_tables = function(mysql_tables) {
    this.connection = mysql_tables.connection;
    this.db_name = mysql_tables.db_name;
};

Mysql_tables.create = (mysql_tables) => {
    var CREATE_TABLE_USERS_STATMENT = `CREATE TABLE ${mysql_tables.db_name}.users (username VARCHAR(20) PRIMARY KEY,firstname VARCHAR(30),email VARCHAR(65),password VARCHAR(512),recovery_key VARCHAR(512))`;
    var CREATE_TABLE_BUCKET = `CREATE TABLE ${mysql_tables.db_name}.buckets (bucket VARCHAR(30) PRIMARY KEY, username VARCHAR(20), FOREIGN KEY (username) references users (username));
    `;
    var CREATE_TABLE_FILE = `CREATE TABLE ${mysql_tables.db_name}.files (FileName VARCHAR (255) PRIMARY KEY, FileSize VARCHAR(255), UploadDate DATE, bucket_user VARCHAR(30), FOREIGN KEY (bucket_user) references buckets (bucket))
    `;

    mysql_tables.connection.query(CREATE_TABLE_USERS_STATMENT, function(error, res) {
        if (error) throw error;

        console.log(res);
    });
    mysql_tables.connection.query(CREATE_TABLE_BUCKET, function(error, res) {
        if (error) throw error;

        console.log(res);
    });
    mysql_tables.connection.query(CREATE_TABLE_FILE, function(error, res) {
        if (error) throw error;

        console.log(res);
    });

}
module.exports = Mysql_tables;