const express = require('express');

const db = require('../db/index');

const router = express.Router();


router.get('', async (req, res) => {
  try {
    productsData = await db.getProducts(req.query.category_id);
    res.status(200).json(productsData);
  } catch(err) {
    res.status(500).send('Query failed.');
  }
});


module.exports = router;
