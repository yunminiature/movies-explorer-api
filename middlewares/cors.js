const express = require('express');

const allowedCors = [
  'https://bitfilms.nomoredomains.rocks',
  'http://bitfilms.nomoredomains.rocks',
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = express.Router();
cors.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

module.exports = cors;
