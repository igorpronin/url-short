const createError = require('http-errors');
const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { MongoClient, ObjectID } = require('mongodb');
// const test = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'urlShortener';


const appRoot = require('app-root-path');
const appRootPath = appRoot.path;
require('dotenv').config({path: `${appRootPath}/.env`});

const indexRouter = require('./routes/indexRouter');
const linkApiRouter = require('./routes/linkApiRouter');
const linkRouter = require('./routes/linkRouter');

app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.all('*', (req, res, next) => {
  if (req.cookies) {
    res.locals.userId = req.cookies.userId;
  }
  console.log('Income request');
  next();
});

app.use('/', indexRouter);
app.use('/link', linkApiRouter);
app.use('*', linkRouter);

app.listen(3000, () => {
  console.log('The server is listening on port 3000...');
});