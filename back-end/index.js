require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logging = require('morgan');
const passport = require('passport');
const session = require('express-session');

const auth = require('./auth');

const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const categoriesRouter = require('./routes/categories');
const checkoutRouter = require('./routes/checkout');
const docsRouter = require('./routes/docs');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const api = express();
const port = process.env.PORT;

// https://expressjs.com/en/resources/middleware/morgan.html
api.use(logging(process.env.LOGGING));


// https://expressjs.com/en/resources/middleware/cors.html
const devOrigin = ["https://web.postman.co/", "http://localhost", /http:\/\/localhost:.*/];
const prodOrigin = process.env.FRONT_END_BASE_URL;
const origin = process.env.NODE_ENV !== "production" ? devOrigin : prodOrigin;

api.use(cors({
  origin,
  credentials: true,
}));


// https://www.passportjs.org/concepts/authentication/sessions/
// https://www.passportjs.org/howtos/session/
// https://expressjs.com/en/resources/middleware/session.html

if (process.env.NODE_ENV === 'production') {
  // https://expressjs.com/en/guide/behind-proxies.html
  // https://stackoverflow.com/a/75418142/11262798
  api.set('trust proxy', 1);

  api.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none'
    },
  }));

} else {
  api.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));
}

// Authenticate all routes and add user data to req.user
api.use(passport.initialize());
api.use(passport.authenticate('session'));
passport.serializeUser(auth.serialize);
passport.deserializeUser(auth.deserialize);


api.get('/', (req, res) => {
  res.status(200).send(
    req.isAuthenticated() ? `Logged in as ${req.user.email_address}.` : 'Logged out.'
  );
});

api.use('/auth', authRouter);
api.use('/cart', cartRouter);
api.use('/categories', categoriesRouter);
api.use('/checkout', checkoutRouter);
api.use('/docs', docsRouter);
api.use('/orders', ordersRouter);
api.use('/products', productsRouter);
api.use('/users', usersRouter);

api.server = api.listen(port, () => {
  console.log(`Server listening on port ${port} in the ${process.env.NODE_ENV} environment.`);
});

module.exports = api;