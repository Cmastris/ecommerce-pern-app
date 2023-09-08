const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');

const db = require('../db/index');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();


router.get('/register', jsonParser, (req, res) => {
  res.send('Hello World!');
});

router.post('/register', jsonParser, async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await db.usernameExists(username);
    if (userExists) {
      return res.status(400).send(
        `Registration failed. The username '${username}' is not available; please choose another.`
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = await db.addUser(username, hashedPassword);
    res.status(201).json(userData);
  } catch(err) {
    console.log(err);
    res.status(500).send(
      'Registration failed. Please ensure you are providing the required data.'
    );
  }
});


module.exports = router;
