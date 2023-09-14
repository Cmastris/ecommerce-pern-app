const express = require('express');

const db = require('../db/index');
const requireLogin = require('./middleware');

const router = express.Router();

router.get('', requireLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const ordersSummary = await db.getOrdersSummary(userId);
    res.status(200).json(ordersSummary);
  } catch(err) {
    res.status(500).send('Orders retrieval failed.');
  }
});


module.exports = router;