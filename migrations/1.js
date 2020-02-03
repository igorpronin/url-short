const MongoClient = require('mongodb').MongoClient;
// const test = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'urlShortener';

// Connect using MongoClient

MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
  if (err) throw err;
  const dbo = client.db(dbName);
  dbo.createCollection("users", (err, res) => {
    if (err) throw err;
    console.log("Collection created!");
  });
  dbo.createCollection("links", (err, res) => {
    if (err) throw err;
    console.log("Collection created!");
  });
});
