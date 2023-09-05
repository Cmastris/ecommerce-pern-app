require('dotenv').config();
const express = require('express');

const api = express();
const port = process.env.PORT;

api.get('/', (req, res) => {
  res.send('Hello World!');
});

api.listen(port, () => {
  console.log(`API server listening on port ${port}.`);
});
