const express = require('express');

const db = require('../db/index');

const router = express.Router();


router.get('', async (req, res) => {
  try {
    categoriesData = await db.getCategories();
    res.status(200).json(categoriesData);
  } catch(err) {
    res.status(500).send('Query failed.');
  }
});


module.exports = router;
