const pg = require('pg');

// Setup
const pool = new pg.Pool();

const query = (text, params, callback) => {
  console.log('Making query...');
  // https://node-postgres.com/features/pooling#single-query
  return pool.query(text, params, callback);
};


// Users

const emailExists = async (email_address) => {
  const res = await query(
    'SELECT email_address FROM users WHERE email_address=$1',
    [email_address]
  );
  return res.rowCount > 0;
};

const getUserByEmail = async (email_address) => {
  const res = await query(
    'SELECT id, email_address, hashed_pw FROM users WHERE email_address=$1',
    [email_address]
  );
  return res.rows[0];
};

const addUser = async (email_address, hashed_pw) => {
  const res = await query(
    'INSERT INTO users(email_address, hashed_pw) VALUES($1, $2) RETURNING id, email_address',
    [email_address, hashed_pw]
  );
  return res.rows[0];
};

const updateUserPassword = async (id, hashed_pw) => {
  await query(
    'UPDATE users SET hashed_pw = $1 WHERE id=$2',
    [hashed_pw, id]
  );
  return;
};


// Exports
module.exports = {
  query,
  emailExists,
  getUserByEmail,
  addUser,
  updateUserPassword
};