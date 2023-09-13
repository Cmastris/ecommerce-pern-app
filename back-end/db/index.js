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


// Products
const getProducts = async (category_id=undefined) => {
  const baseQuery = 'SELECT id, name, price, available_stock_count, short_description, long_description, avg_rating, rating_count FROM products';
  let res;
  if (category_id) {
    res = await query(
      baseQuery + ' JOIN product_categories ON products.id=product_categories.product_id WHERE product_categories.category_id=$1',
      [category_id]
    );
  } else {
    res = await query(baseQuery);
  }
  return res.rows;
};

const getProductById = async (id) => {
  const baseQuery = 'SELECT id, name, price, available_stock_count, short_description, long_description, avg_rating, rating_count FROM products';
  const res = await query(baseQuery + ' WHERE id=$1', [id]);
  return res.rows[0];
};


// Categories
const getCategories = async () => {
  res = await query('SELECT id, name, description, url_slug FROM categories');
  return res.rows;
};


// Cart
const getCartItems = async (user_id) => {
  const select = 'SELECT product_id, name AS product_name, price AS product_price, quantity AS product_quantity FROM cart_products';
  const join = 'JOIN products ON cart_products.product_id = products.id';
  res = await query(`${select} ${join} WHERE user_id=$1`, [user_id]);
  return res.rows;
};

const cartItemExists = async (user_id, product_id) => {
  res = await query(
    'SELECT user_id, product_id FROM cart_products WHERE user_id=$1 AND product_id=$2',
    [user_id, product_id]
  );
  return res.rowCount > 0;
};

const addCartItem = async (user_id, product_id, product_quantity=1) => {
  const insert = 'INSERT INTO cart_products(user_id, product_id, quantity) VALUES($1, $2, $3)';
  const update = 'UPDATE products SET available_stock_count = (available_stock_count - $3) WHERE id=$2 RETURNING name, price';
  const res = await query(
    `WITH product AS (${insert}) ${update}`,
    [user_id, product_id, product_quantity]
  );
  const product_name = res.rows[0].name;
  const product_price = res.rows[0].price;
  return { product_id, product_name, product_price, product_quantity };
};

const deleteCartItem = async (user_id, product_id) => {
  const deleteRes = await query(
    'DELETE FROM cart_products WHERE user_id=$1 AND product_id=$2 RETURNING quantity',
    [user_id, product_id]
  );
  try {
    // TypeError if cart item didn't exist (quantity undefined)
    const quantity = deleteRes.rows[0].quantity;
    await query(
      'UPDATE products SET available_stock_count = (available_stock_count + $1) WHERE id=$2',
      [quantity, product_id]
    );
  } catch(err) {
    console.log(err);
  }
  return;
};


// Exports
module.exports = {
  query,
  emailExists,
  getUserByEmail,
  addUser,
  updateUserPassword,
  getProducts,
  getProductById,
  getCategories,
  getCartItems,
  cartItemExists,
  addCartItem,
  deleteCartItem
};