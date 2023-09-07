require('dotenv').config();
const express = require('express');
const logging = require('morgan');

const auth = require('./routes/auth');

const api = express();
const port = process.env.PORT;

// https://expressjs.com/en/resources/middleware/morgan.html
api.use(logging(process.env.LOGGING));

api.use('/auth', auth);

api.listen(port, () => {
  console.log(`Server listening on port ${port} in the ${process.env.NODE_ENV} environment.`);
});
