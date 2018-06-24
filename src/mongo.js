//const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://admin:p4ssw0rd@ds261470.mlab.com:61470/pxgseb_test";
const MONGO_DB = "pxgseb_test";

module.exports = function (app) {
  // MongoClient.connect(MONGO_URL, function (err, client) {
  //   assert.equal(null, err);
  //   console.log("Connected successfully to server");

  //   const db = client.db(MONGO_DB);
  //   app.people = db.collection("people");


  //   //client.close();
  // });
  MongoClient.connect(MONGO_URL)
    .then((client) => {
      const connection = client.db(MONGO_DB);
      app.people = connection.collection("people");
      console.log("Database connection established")
    })
    .catch((err) => {
      console.error(err)
    })
};