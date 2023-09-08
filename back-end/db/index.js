const pg = require('pg');
 
const pool = new pg.Pool();
 
const query = (text, params, callback) => {
  console.log('Making query...');
  // https://node-postgres.com/features/pooling#single-query
  return pool.query(text, params, callback);
};

module.exports = query;