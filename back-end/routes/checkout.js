const bodyParser = require('body-parser');
const express = require('express');

const db = require('../db/index');
const requireLogin = require('./middleware');

const router = express.Router();

// https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json();

// https://stripe.com/docs/checkout/embedded/quickstart?client=react&lang=node
// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=embedded-checkout
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);


router.post('/create-pending-order', requireLogin, jsonParser, async (req, res) => {
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

    // Create pending order
    const orderDetails = await db.createPendingOrder(userId, addressId);
    res.status(201).json(orderDetails);

  } catch(err) {
    res.status(500).send('Order creation failed. Please ensure you are providing valid data.');
  }
});


router.post('/create-payment-session', requireLogin, async (req, res) => {
  // Create a Stripe payment session before payment
  try {
    const orderId = req.query.order_id;
    const orderData = await db.getOrderById(orderId);

    // Generate checkout session Price objects (payment line items)
    const orderItemsData = orderData.order_items.map(item => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product_name,
          },
          unit_amount: (Number(item.product_price.substring(1)) * 100),  // Price in cents
        },
        quantity: Number(item.product_quantity),
      }
    });

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: orderItemsData,
      mode: 'payment',
      return_url: `${process.env.FRONT_END_BASE_URL}/checkout/${orderId}/payment-return?session_id={CHECKOUT_SESSION_ID}`,
    });
  
    res.send({clientSecret: session.client_secret});

  } catch(err) {
    res.status(500).send();
  }
});


router.get('/payment-session-status', async (req, res) => {
  // Retrieve the payment status (complete or failed/cancelled) after an attempted payment
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  res.send({ status: session.status });
});


router.put('/confirm-paid-order', async (req, res) => {
  // Update the order status if payment was pending and has now been completed
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  if (session.status === 'complete') {
    try {
      const orderId = req.query.order_id;
      if (!orderId) {
        throw new Error('Order ID not included in request; order status could not be updated.');
      }
      const orderStatus = await db.getOrderStatus(orderId);
      if (orderStatus === 'payment pending') {
        await db.confirmPaidOrder(orderId);
      }
    } catch(err) {
      // In production, log/alert to investigate and update order status manually
      console.log(err);
    }
  }
  res.send();
});


module.exports = router;
