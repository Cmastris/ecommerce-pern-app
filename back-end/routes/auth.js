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
  const email_address = username;
  try {
    const user = await db.getUserByEmail(email_address);
    if (!user) {
      return done(null, false,
        { message: `An account with the email address '${email_address}' does not exist.` }
      );
    }
    const matchedPassword = await bcrypt.compare(password, user.hashed_pw);
    if (!matchedPassword) {
      return done(null, false, { message: 'Incorrect email address or password.' });
    }
    return done(null, { id: user.id, email_address: user.email_address });

  } catch(err) {
    return done(err);
  }
}

passport.use(new LocalStrategy(verify));


router.get('/status', (req, res) => {
  let jsonData;
  if (!req.isAuthenticated()) {
    jsonData = { logged_in: false, id: null, email_address: null };
  } else {
    jsonData = { logged_in: true, id: req.user.id, email_address: req.user.email_address };
  }
  res.status(200).json(jsonData);
});

router.get('/register', jsonParser, (req, res) => {
  res.status(404).send('Please make a valid POST request to register.');
});

router.post('/register', jsonParser, async (req, res) => {
  try {
    const { email_address, password } = req.body;

    const userExists = await db.emailExists(email_address);
    if (userExists) {
      return res.status(400).send(
        `Registration failed. The email '${email_address}' is already registered; please use another.`
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = await db.addLocalUser(email_address, hashedPassword);
    
    try {
      req.login(userData, function() {
        return res.status(201).json(userData);
      });
    } catch(err) {
      // Login failed; just return new user data
      return res.status(201).json(userData);
    }
  } catch(err) {
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
    res.status(200).json({ id: req.user.id, email_address: req.user.email_address });
  }
);

router.post('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return res.status(500).send('Sorry, logout failed.');
      }
    });
  }
  res.status(200).send();
});

module.exports = router;
