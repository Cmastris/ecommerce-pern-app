const bodyParser = require('body-parser');
const express = require('express');

const db = require('../db/index');
const requireLogin = require('./middleware');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();


router.post('/create-order', requireLogin, jsonParser, async (req, res) => {
  try {
    // Check address details were provided
    const { address, postcode } = req.body;
    if (!(address && postcode)) {
      return res.status(400).send('Please provide a valid address and postcode in the request body.');
    }

    // Check cart isn't empty
    const userId = req.user.id;
    const cartItems = await db.getCartItems(userId);
    if (cartItems.length < 1) {
      return res.status(400).send('Your cart is empty.');
    }

    // Retrieve or create address
    let addressId = await db.getAddressId(address, postcode);
    if (!addressId) {
      addressId = await db.addAddress(address, postcode);
    }

    // Create order
    const orderDetails = await db.createOrder(userId, addressId);
    res.status(201).json(orderDetails);

  } catch(err) {
    console.log(err);
    res.status(500).send('Checkout failed. Please ensure you are providing valid data.');
  }
});


module.exports = router;