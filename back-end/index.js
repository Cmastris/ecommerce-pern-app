require('dotenv').config();
const express = require('express');
const logging = require('morgan');
const passport = require('passport');
const session = require('express-session');

const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const api = express();
const port = process.env.PORT;

// https://expressjs.com/en/resources/middleware/morgan.html
api.use(logging(process.env.LOGGING));


// https://www.passportjs.org/concepts/authentication/sessions/
// https://www.passportjs.org/howtos/session/
api.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// Authenticate all routes and add user data to req.user
api.use(passport.initialize());
api.use(passport.authenticate('session'));

passport.serializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, { id: user.id, email_address: user.email_address });
  });
});

passport.deserializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
});


api.get('/', (req, res) => {
  res.status(200).send(
    req.isAuthenticated() ? `Logged in as ${req.user.email_address}.` : 'Logged out.'
  );
});

api.use('/auth', authRouter);
api.use('/cart', cartRouter);
api.use('/categories', categoriesRouter);
api.use('/products', productsRouter);
api.use('/users', usersRouter);

api.server = api.listen(port, () => {
  console.log(`Server listening on port ${port} in the ${process.env.NODE_ENV} environment.`);
});

module.exports = api;