require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const logging = require('morgan');

const api = express();
const port = process.env.PORT;

// https://expressjs.com/en/resources/middleware/morgan.html
api.use(logging(process.env.LOGGING));

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();

api.get('/', (req, res) => {
  res.send('Hello World!');
});

api.listen(port, () => {
  console.log(`API server listening on port ${port}.`);
});
