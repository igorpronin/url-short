const express = require('express');
const router = express.Router();
const { MongoClient, ObjectID } = require('mongodb');
// const test = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'urlShortener';

router.get('*', (req, res, next) => {

  const shortLink = req.originalUrl.substr(1);
  console.log('route: *');

  MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.collection("links").findOne(
      { shortURL: shortLink },
      {},
      (err, dbRes) => {
        if (dbRes) {
          const linkId = dbRes._id;
          const longURL = dbRes.URL;
          dbo.collection("links").findOneAndUpdate(
            { _id: new ObjectID(linkId) },
            { $inc: { visits: 1 } },
            { upsert: true },
            (err, dbRes) => {
              res.redirect(longURL)
            }
          )
        } else {
          res.status(404).render('pages/404');
        }
      });
  });

});

module.exports = router;