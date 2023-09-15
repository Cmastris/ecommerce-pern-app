const express = require('express');

const db = require('../db/index');
const requireLogin = require('./middleware');

const router = express.Router();

const checkIdValidity = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const orderUserId = await db.getOrderUserId(orderId);
    if (!orderUserId) {
      return res.status(404).send(`An order with the ID '${orderId}' does not exist.`);
    } else if (orderUserId !== req.user.id) {
      return res.status(401).send(
        'Invalid credentials. You cannot view another user\'s order.'
      );
    }
    next();

  } catch(err) {
    res.status(500).send('Query failed. Please ensure you provided a valid order ID.');
  }
};

router.get('', requireLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const ordersSummary = await db.getOrdersSummary(userId);
    res.status(200).json(ordersSummary);
  } catch(err) {
    res.status(500).send('Orders retrieval failed.');
  }
});

router.get('/:id', requireLogin, checkIdValidity, async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await db.getOrderById(orderId);
    res.status(200).json(orderData);

  } catch(err) {
    res.status(500).send('Query failed. Please ensure you provided a valid order ID.');
  }
});


module.exports = router;