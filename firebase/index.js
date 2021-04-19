var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
