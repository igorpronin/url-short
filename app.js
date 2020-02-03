const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const appRoot = require('app-root-path');
const appRootPath = appRoot.path;
require('dotenv').config({path: `${appRootPath}/.env`});

app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res, next) => {
  console.log('Income request');
  res.send('ok');
});

app.listen(3000, () => {
  console.log('The server is listening on port 3000...');
});