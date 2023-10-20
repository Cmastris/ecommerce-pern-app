const bcrypt = require('bcrypt');
const db = require('./db/index');


// ==== Local Login ====

// https://www.passportjs.org/concepts/authentication/password/
// https://www.passportjs.org/tutorials/password/
// https://www.passportjs.org/howtos/password/
// https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}


async function localVerify(username, password, done) {
  const email_address = username;
  try {
    const user = await db.getUserByEmail(email_address, 'local');
    if (!user) {
      return done(null, false,
        { message: `An account with the email address '${email_address}' does not exist.` }
      );
    }
    const matchedPassword = await bcrypt.compare(password, user.hashed_pw);
    if (!matchedPassword) {
      return done(null, false, { message: 'Incorrect email address or password.' });
    }
    return done(null, {
      id: user.id,
      email_address: user.email_address,
      auth_method: user.auth_method
    });

  } catch(err) {
    return done(err);
  }
}


// ==== Google Login ====

// https://www.passportjs.org/concepts/authentication/google/
// https://www.passportjs.org/tutorials/google/
// https://www.passportjs.org/reference/normalized-profile/
// https://console.cloud.google.com/apis/dashboard

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/redirect',
  scope: ['email']
}

async function googleVerify(issuer, profile, done) {
  const email_address = profile.emails[0].value;
  try {
    let user = await db.getUserByEmail(email_address, 'google');
    if (!user) {
      user = await db.addGoogleUser(email_address);
    }
    return done(null, {
      id: user.id,
      email_address: user.email_address,
      auth_method: 'google'
    });
  } catch(err) {
    return done(null, null);
  }
}


// ==== Serialization and Deserialization ====

// https://www.passportjs.org/concepts/authentication/sessions/
// https://www.passportjs.org/howtos/session/

function serialize(user, done) {
  process.nextTick(function() {
    return done(null, {
      id: user.id,
      email_address: user.email_address,
      auth_method: user.auth_method
    });
  });
}


function deserialize(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
}


module.exports = {
  hashPassword,
  localVerify,
  googleConfig,
  googleVerify,
  serialize,
  deserialize
};
