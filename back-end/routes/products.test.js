const request = require('supertest');
const api = require('../index');

// https://jestjs.io/docs/manual-mocks
jest.mock('../db/index');

// https://github.com/ladjs/supertest
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

test('GET /products returns a 200 status code', async () => {
   const res = await request(api).get('/products');
   expect(res.statusCode).toBe(200);
});

test('GET /products without a query returns all products', async () => {
  const res = await request(api).get('/products');
  expect(res.text).toBe('[{},{},{},{},{}]');
});

test('GET /products with a category_id query returns filtered products', async () => {
  const res = await request(api).get('/products?category_id=1');
  expect(res.text).toBe('[{},{},{}]');
});


afterAll(() => {
  // https://stackoverflow.com/q/8659011/11262798
  api.server.close();
});
