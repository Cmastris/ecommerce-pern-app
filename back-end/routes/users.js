const express = require('express');

const router = express.Router();


router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!req.isAuthenticated() || id !== String(req.user.id)) {
    return res.status(401).send(
      `Invalid credentials. You must be logged in as the user with id: ${id}.`
    );
  }
  res.status(200).send({ id: req.user.id, username: req.user.username });
});


module.exports = router;
