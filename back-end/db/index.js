const pg = require('pg');

// Setup
const pool = new pg.Pool();

const query = (text, params, callback) => {
  console.log('Making query...');
  // https://node-postgres.com/features/pooling#single-query
  return pool.query(text, params, callback);
};


// Users

const usernameExists = async (username) => {
  const res = await query(
    'SELECT username FROM users WHERE username=$1',
    [username]
  );
  return res.rowCount > 0;
};

const getUserByUsername = async (username) => {
  const res = await query(
    'SELECT id, username, hashed_pw FROM users WHERE username=$1',
    [username]
  );
  return res.rows[0];
};

const addUser = async (username, hashed_pw) => {
  const res = await query(
    'INSERT INTO users(username, hashed_pw) VALUES($1, $2) RETURNING id, username',
    [username, hashed_pw]
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
  usernameExists,
  getUserByUsername,
  addUser,
  updateUserPassword
};