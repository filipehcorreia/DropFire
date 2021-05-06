const bucket_controller = require('../controllers/bucket_controller.js');
const db_controller = require('../controllers/mysql_controller.js');

const CREATE_BUCKET_STATEMENT = 'INSERT INTO buckets VALUES (?,?)'; //bucket , username 


// constructor
const Bucket = function(bucket) {
    this.bucket_name = bucket.bucket_name;
    this.bucket_username = bucket.bucket_username;
};

Bucket.create = async(bucketToCreate, result) => {
    try {
        const [bucket] = await bucket_controller.createBucket(bucketToCreate.bucket_name, {
            location: 'EU',
            storageClass: 'STANDARD'
        });

        //
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