const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const LocalStrategy = require('passport-local');
const passport = require('passport');

const db = require('../db/index');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();


// https://www.passportjs.org/concepts/authentication/password/
// https://www.passportjs.org/tutorials/password/
// https://www.passportjs.org/howtos/password/
// https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5

async function verify(username, password, done) {
  try {
    const user = await db.getUserByUsername(username);
    if (!user) {
      return done(null, false,
        { message: `An account with the username '${username}' does not exist.` }
      );
    }
    const matchedPassword = await bcrypt.compare(password, user.hashed_pw);
    if (!matchedPassword) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, { id: user.id, username: user.username });

  } catch(err) {
    return done(err);
  }
}

passport.use(new LocalStrategy(verify));


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

router.get('/login', jsonParser, (req, res) => {
  res.status(404).send('Please make a valid POST request to log in.');
});

router.post('/login',
  jsonParser,
  passport.authenticate('local', { failureMessage: true }),
  function(req, res) {
    res.status(200).json({ id: req.user.id, username: req.user.username });
  });

module.exports = router;
