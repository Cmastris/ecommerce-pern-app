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

const getUserByEmail = async (email_address, auth_method) => {
  const baseQuery = 'SELECT id, email_address, hashed_pw, auth_method FROM users';
  const filter = ' WHERE email_address=$1 AND auth_method=$2';
  const res = await query(baseQuery + filter, [email_address, auth_method]);
  return res.rows[0];
};

const addLocalUser = async (email_address, hashed_pw) => {
  const res = await query(
    'INSERT INTO users(email_address, hashed_pw, auth_method) VALUES($1, $2, $3) RETURNING id, email_address',
    [email_address, hashed_pw, 'local']
  );
  return res.rows[0];
};

const addGoogleUser = async (email_address) => {
  const res = await query(
    'INSERT INTO users(email_address, auth_method) VALUES($1, $2) RETURNING id, email_address',
    [email_address, 'google']
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
const getProducts = async (category_id=undefined, search_term=undefined) => {
  const baseQuery = 'SELECT id, name, price, available_stock_count, short_description, long_description, avg_rating, rating_count FROM products';
  let res;
  if (category_id) {
    res = await query(
      baseQuery + ' JOIN product_categories ON products.id=product_categories.product_id WHERE product_categories.category_id=$1',
      [category_id]
    );
  } else if (search_term) {
    res = await query(
      baseQuery + ' WHERE LOWER(name) LIKE $1',
      ['%' + search_term.toLowerCase() + '%']
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


// Addresses
const getAddressById = async (id) => {
  const res = await query('SELECT address, postcode FROM addresses WHERE id=$1', [id]);
  return res.rows[0];
};

const getAddressId = async (address, postcode) => {
  const res = await query(
    'SELECT id FROM addresses WHERE address=$1 AND postcode=$2',
    [address, postcode]
  );
  return res.rows.length === 1 ? res.rows[0].id : undefined;
};

const addAddress = async (address, postcode) => {
  const res = await query(
    'INSERT INTO addresses(address, postcode) VALUES($1, $2) RETURNING id',
    [address, postcode]
  );
  return res.rows[0].id;
};


// Checkout
const createPendingOrder = async (user_id, address_id) => {
  // Create a pending order for all current cart items ahead of successful payment

  // Get cart items
  const cartItems = await getCartItems(user_id);

  // https://node-postgres.com/features/transactions
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create pending order record
    let total_cost = 0;
    const order_status = 'payment pending';
    const orderCreationRes = await client.query(
      'INSERT INTO orders(user_id, address_id, status, total_cost) VALUES($1, $2, $3, $4) RETURNING id',
      [user_id, address_id, order_status, total_cost]
    );
    const order_id = orderCreationRes.rows[0].id;

    // Update order_products table and calculate total order cost
    for await (const p of cartItems) {
      const { product_id, product_quantity, product_price } = p;

      // Add product to order_products table
      await client.query(
        'INSERT INTO order_products(order_id, product_id, product_quantity) VALUES($1, $2, $3)',
        [order_id, product_id, product_quantity]
      );

      // Increment total order cost
      total_cost += Number(product_price.substring(1)) * product_quantity;
    };

    // Update order total_cost and retrieve order details
    const orderSummaryRes = await client.query(
      'UPDATE orders SET total_cost=$1 WHERE id=$2 RETURNING order_placed_time, total_cost',
      [total_cost, order_id]
    );
    const order_placed_time = orderSummaryRes.rows[0].order_placed_time;
    total_cost = orderSummaryRes.rows[0].total_cost;

    // Retrieve address details
    const addressRes = await client.query(
      'SELECT address, postcode FROM addresses WHERE id=$1',
      [address_id]
    );
    const { address, postcode } = addressRes.rows[0];

    // Commit updates and return order details
    await client.query('COMMIT');
    return {
      order_id,
      user_id: Number(user_id),
      order_items: cartItems,
      order_placed_time,
      order_status,
      total_cost,
      address,
      postcode
    };

  } catch(err) {
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }
};


const confirmPaidOrder = async (order_id) => {
  // Confirm an order after successful payment
  // Update order status and time; reduce product stock count; clear cart

  // Update order status and order placed time
  const status = 'processing order';
  await query(
    'UPDATE orders SET order_placed_time=(SELECT LOCALTIMESTAMP), status=$1 WHERE id=$2',
    [status, order_id]
  );  

  const order = await getOrderById(order_id);

  // https://node-postgres.com/features/transactions
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // For each order item, reduce stock count and delete cart item
    for await (const product of order.order_items) {
      const { product_id, product_quantity } = product;

      // Reduce the product's stock count
      await client.query(
        'UPDATE products SET stock_count = (stock_count - $1) WHERE id=$2',
        [product_quantity, product_id]
      );

      // Delete the product from the user's cart
      await client.query(
        'DELETE FROM cart_products WHERE user_id=$1 AND product_id=$2',
        [order.user_id, product_id]
      );
    };

    // Commit updates and return order details
    await client.query('COMMIT');

  } catch(err) {
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }
};


// Orders
const getOrdersSummary = async (user_id) => {
  const select = 'SELECT id AS order_id, order_placed_time, status AS order_status, total_cost';
  res = await query(
    `${select} FROM orders WHERE user_id=$1 ORDER BY order_id DESC`,
    [user_id]
  );
  return res.rows;
};

const getOrderUserId = async (id) => {
  const res = await query('SELECT user_id FROM orders WHERE id=$1', [id]);
  return res.rows[0] ? res.rows[0].user_id : undefined;
};

const getOrderStatus = async (id) => {
  const res = await query('SELECT status FROM orders WHERE id=$1', [id]);
  return res.rows[0] ? res.rows[0].status : undefined;
};

const getOrderById = async (id) => {
  const orderSelect = 'SELECT orders.id, user_id, order_placed_time, status, total_cost, address, postcode';
  const addressesJoin = 'JOIN addresses ON orders.address_id = addresses.id';
  const orderRes = await query(
    `${orderSelect} FROM orders ${addressesJoin} WHERE orders.id=$1`,
    [id]
  );

  const orderItemsSelect = 'SELECT product_id, name AS product_name, price AS product_price, product_quantity';
  const productsJoin = 'JOIN products ON order_products.product_id = products.id'
  const orderItemsRes = await query(
    `${orderItemsSelect} FROM order_products ${productsJoin} WHERE order_id=$1`,
    [id]
  );

  return {
    order_id: orderRes.rows[0].id,
    user_id: orderRes.rows[0].user_id,
    order_items: orderItemsRes.rows,
    order_placed_time: orderRes.rows[0].order_placed_time,
    order_status: orderRes.rows[0].status,
    total_cost: orderRes.rows[0].total_cost,
    address: orderRes.rows[0].address,
    postcode: orderRes.rows[0].postcode
  };
};

const updateOrderStatus = async (id, status) => {
  await query(
    'UPDATE orders SET status=$1 WHERE id=$2',
    [status, id]
  );
  return;
};


// Exports
module.exports = {
  query,
  emailExists,
  getUserByEmail,
  addLocalUser,
  addGoogleUser,
  updateUserPassword,
  getProducts,
  getProductById,
  getCategories,
  getCartItems,
  cartItemExists,
  addCartItem,
  deleteCartItem,
  getAddressById,
  getAddressId,
  addAddress,
  createPendingOrder,
  confirmPaidOrder,
  getOrdersSummary,
  getOrderUserId,
  getOrderStatus,
  getOrderById,
  updateOrderStatus,
};