const bucket_controller = require('../controllers/bucket_controller.js')

//const CREATE_BUCKET_STATEMENT = 'INSERT INTO buckets VALUES (?,?)';


// constructor
const Bucket = function(bucket) {
    this.bucket_name = bucket.bucket_name;
    this.storageClass = 'standart';
};

Bucket.create = async(bucketToCreate, result) => {
    try {
        const [bucket] = await bucket_controller.createBucket(bucketToCreate.bucket_name, {
            location: bucketToCreate.location,
            [bucketToCreate.storageClass]: true,
        });

        console.log(
            `${bucket.name} created with ${storageClass} class in ${location}`
        );

    } catch (e) {
        console.log(e);
        result(true, null);
        return;
    }

    result(false, bucket);
    return;

};


module.exports = Bucket;