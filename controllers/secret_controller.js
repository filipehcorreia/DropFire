// Imports the Google Cloud client library
const {
    SecretManagerServiceClient
} = require('@google-cloud/secret-manager');

//Declares a new const from type SecretManagerServiceClient
const client = new SecretManagerServiceClient();

//Exports the client, for everyone that will call it
module.exports = client;