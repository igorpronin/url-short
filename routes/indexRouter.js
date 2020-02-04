const express = require('express');
const router = express.Router();
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'urlShortener';

router.get('/', (req, res, next) => {
  console.log('route: /');
  if (res.locals.userId) {
    console.log('Auth user');
    MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
      if (err) throw err;
      const dbo = db.db(dbName);
      dbo.collection('users').findOne(
        { _id: new ObjectID(res.locals.userId)},
        {},
        (err, dbRes) => {
          if (dbRes) {
            const links = dbRes.links;
            const preparedLinks = [];
            links.map((el, index) => {
              preparedLinks.push(new ObjectID(el));
            });
            dbo
              .collection('links')
              .find(
                { _id: { $in: preparedLinks } },
                { limit: 1000 },
                (err, dbRes) => {
                  if (err) throw err;
                  const links = [];
                  const prom = dbRes.forEach(doc => {
                    doc.shortURL = `${req.protocol}://${req.headers.host}/${doc.shortURL}`;
                    links.push(doc);
                  });
                  prom.then(() => {
                    db.close();
                    res.render('pages/index', { links });
                  });
                });
          }
        }
      )
    });
  } else {
    console.log('NON auth user');
    res.render('pages/index', { links: false });
  }

});

module.exports = router;