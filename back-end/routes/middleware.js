const requireLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('You must be logged in to access this endpoint.');
  }
  next();
};

module.exports = requireLogin;
