const bodyParser = require('body-parser');
const express = require('express');

const db = require('../db/index');
const requireLogin = require('./middleware');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();

router.get('', requireLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await db.getCartItems(userId);
    res.status(200).json(cartItems);
  } catch(err) {
    res.status(500).send('Cart retrieval failed.');
  }
});

router.post('/items/:id', requireLogin, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const product = await db.getProductById(productId);
    if (!product) {
      return res.status(404).send(`A product with the ID '${productId}' does not exist.`);
    }

    const requestedQuantity = req.query.quantity ? Number(req.query.quantity) : 1;
    const availableQuantity = product.available_stock_count;
    if (requestedQuantity > availableQuantity) {
      return res.status(400).send(`The available stock count is ${availableQuantity}.`);
    }

    const userId = req.user.id;
    const itemExists = await db.cartItemExists(userId, productId);
    if (itemExists) {
      return res.status(400).send('This product is already in your cart.');
    }

    const cartItem = await db.addCartItem(userId, productId, requestedQuantity);
    res.status(201).json(cartItem);

  } catch(err) {
    res.status(500).send(
      'Cart update failed. Please ensure you are providing valid data.'
    );
  }
});

router.delete('/items/:id', requireLogin, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    await db.deleteCartItem(userId, productId);
    res.status(204).send();
  } catch(err) {
    res.status(500).send(
      'Cart update failed. Please ensure you are providing valid data.'
    );
  }
});

router.post('/checkout', requireLogin, jsonParser, async (req, res) => {
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
    const orderDetails = await db.checkout(userId, addressId);
    res.status(201).json(orderDetails);

  } catch(err) {
    console.log(err);
    res.status(500).send('Checkout failed. Please ensure you are providing valid data.');
  }
});


module.exports = router;