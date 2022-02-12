const admin = require("firebase-admin");
const serviceAccount = require("./cozy-57e78-firebase-adminsdk-h4pqw-d2ac2e2a7c");
const dotenv = require("dotenv");

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require("./api"),
};