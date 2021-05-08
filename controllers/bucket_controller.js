// Imports the Google Cloud client library
const {
    Storage
} = require('@google-cloud/storage');

//Declares a new const from type Storage
const storage = new Storage();


//Exports the storage, for everyone that will call it
module.exports = storage;