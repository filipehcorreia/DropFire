
const project_id = "genuine-plating-311210";
const secret_controller = require("../controllers/secret_controller.js");

// constructor
const Secret = function(secret) {
    this.key = secret.key;
};

Secret.get = async(secretToGet, result) => {
    var name = `projects/${project_id}/secrets/${secretToGet.key}/versions/latest`;
    //console.log("Getting secret" + name);  //Check secret name
    try {
        var [version] = await secret_controller.accessSecretVersion({
            name: name,
        });

        // Extract the payload as a string.
        var payload = version.payload.data.toString();

        // WARNING: Do not print the secret in a production environment - this
        // snippet is showing how to access the secret material.
        result(false, payload);
        return;
    } catch (e) {
        console.log(e);
        result(true, null);
        return;
    }

};




module.exports = Secret;