const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
// const test = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'urlShortener';

router.get('/', (req, res, next) => {
  console.log('route: /');
  if (res.locals.userId) {
    console.log('Auth user');
  } else {
    console.log('NON auth user');
  }
  res.render('pages/index');
});

module.exports = router;