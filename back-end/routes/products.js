const express = require('express');

const db = require('../db/index');

const router = express.Router();


router.get('', async (req, res) => {
  try {
    productsData = await db.getProducts(
      category_id=req.query.category_id,
      search_term=req.query.search_term,
    );
    res.status(200).json(productsData);
  } catch(err) {
    res.status(500).send('Query failed.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    productData = await db.getProductById(req.params.id);
    if (!productData) {
      return res.status(404).send(`A product with the ID '${req.params.id}' does not exist.`);
    }
    res.status(200).json(productData);
  } catch(err) {
    res.status(500).send('Query failed.');
  }
});


module.exports = router;
