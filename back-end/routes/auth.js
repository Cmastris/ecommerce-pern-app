const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();


router.get('/register', jsonParser, (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
