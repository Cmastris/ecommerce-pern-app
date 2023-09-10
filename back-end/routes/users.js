const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');

const db = require('../db/index');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();

router.param('id', (req, res, next, id) => {
  if (!req.isAuthenticated() || id !== String(req.user.id)) {
    return res.status(401).send(
      `Invalid credentials. You must be logged in as the user with id '${id}'.`
    );
  }
  next();
});

router.get('/:id', (req, res) => {
  res.status(200).send({ id: req.user.id, email_address: req.user.email_address });
});

router.put('/:id', jsonParser, async (req, res) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.updateUserPassword(req.params.id, hashedPassword);
    res.status(200).send();

  } catch(err) {
    res.status(500).send(
      'Password update failed. Please ensure you are providing the required data.'
    );
  }
});


module.exports = router;
