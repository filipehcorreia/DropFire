const bucket_controller = require('../controllers/bucket_controller.js');
const db_controller = require('../controllers/mysql_controller.js');

const CREATE_BUCKET_STATEMENT = 'INSERT INTO buckets VALUES (?,?)'; //bucket , username 


// constructor
const Bucket = function(bucket) {
    this.bucket_name = bucket.bucket_name;
    this.bucket_username = bucket.bucket_username;
};


/*
We receive a Bucket object with the bucket's name and the username for whom it will be created.
Then try to create the bucket in the cloud by sending the bucket name , location and Class using the Google cloud storage lib
*/
Bucket.create = async(bucketToCreate, result) => {
    try {
        const [bucket] = await bucket_controller.createBucket(bucketToCreate.bucket_name, {
            location: 'EU',
            storageClass: 'STANDARD'
        });

        /*
            Add a row to the 'buckets' table in the SQL Server containing the bucket's name and the user's username
        */
        db_controller.getConnection(function(err, connection) {
            if (err) throw err; //Error connection to 
            connection.query(CREATE_BUCKET_STATEMENT, [bucketToCreate.bucket_name, bucketToCreate.bucket_username], function(err, res) {
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

    } catch (e) {
        console.log(e);
        result(true, null);
        return;
    }

    result(false, bucket);
    return;

}

module.exports = Bucket;