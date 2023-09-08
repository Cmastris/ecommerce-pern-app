const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');

const db = require('../db/index');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();


router.get('/register', jsonParser, (req, res) => {
  res.status(404).send('Please make a valid POST request to register.');
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

router.post('/login', jsonParser, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(404).send(
        `Login failed. A user with the username '${username}' does not exist.`
      );
    }
    const matchedPassword = await bcrypt.compare(password, user.hashed_pw);
    if (!matchedPassword) {
      return res.status(401).send(`Login failed. Username or password is incorrect.`);
    } else {
      // TODO: implement authentication using Passport local
      res.status(200).json({ id: user.id, username: user.username });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send('Login failed. Please ensure you are providing the required data.');
  }
});

module.exports = router;
