const express = require('express');

const router = express.Router();


router.param('id', (req, res, next, id) => {
  if (!req.isAuthenticated() || id !== String(req.user.id)) {
    return res.status(401).send(
      `Invalid credentials. You must be logged in as the user with id '${id}'.`
    );
  }
  next();
});

router.get('/:id', (req, res) => {
  res.status(200).send({ id: req.user.id, username: req.user.username });
});


module.exports = router;
