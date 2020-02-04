const express = require('express');
const router = express.Router();
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'urlShortener';

router.post('/create', (req, res, next) => {
  console.log('route: /link/create');
  console.log(req.body.link);
  if (req.body.link) {
    if (!res.locals.userId) {
      MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
        if (err) throw err;
        const dbo = db.db(dbName);
        const user = { links: [] };
        dbo.collection("users").insertOne(user, (err, dbRes) => {
          if (err) throw err;
          console.log('1 document inserted');
          const userId = dbRes.insertedId.toString();
          const link = {
            userId: userId,
            URL: req.body.link,
            shortURL: makeShortURL(6),
            visits: 0
          };
          dbo.collection('links').insertOne(link, (err, dbRes) => {
            if (err) throw err;
            console.log("1 document inserted");
            const linkId = dbRes.insertedId.toString();
            dbo
              .collection('users')
              .findOneAndUpdate(
                {_id: new ObjectID(userId) },
                { $push: { links: linkId } },
                { upsert: true },
                (err, dbRes) => {
                  if (err) throw err;
                  db.close();
                }
              );
            res
              .cookie('userId', userId, {expires: new Date(Date.now() + 9000000000000)})
              .json({
                URL: link.URL,
                shortURL: `${req.protocol}://${req.headers.host}/${link.shortURL}`,
              });
          });
        });
      });
    } else {
      MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
        if (err) throw err;
        const dbo = db.db(dbName);
        const link = {
          userId: res.locals.userId,
          URL: req.body.link,
          shortURL: makeShortURL(6),
          visits: 0
        };
        dbo.collection('links').insertOne(link, (err, dbRes) => {
          if (err) throw err;
          console.log("1 document inserted");
          const linkId = dbRes.insertedId.toString();
          dbo
            .collection('users')
            .findOneAndUpdate(
            {_id: new ObjectID(res.locals.userId) },
            { $push: { links: linkId } },
            { upsert: true },
            (err, dbRes) => {
              if (err) throw err;
              db.close();
            }
          );
          res.json({
            URL: link.URL,
            shortURL: `${req.protocol}://${req.headers.host}/${link.shortURL}`,
          });
        });
      });
    }
  } else {
    res.end();
  }
});

function makeShortURL(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;