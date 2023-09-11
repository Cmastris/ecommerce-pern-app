const request = require('supertest');
const api = require('../index');

// https://jestjs.io/docs/manual-mocks
jest.mock('../db/index');

// https://github.com/ladjs/supertest
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

test('GET /categories returns a 200 status code', async () => {
   const res = await request(api).get('/categories');
   expect(res.statusCode).toBe(200);
});

test('GET /categories returns an array of category objects', async () => {
  const res = await request(api).get('/categories');
  expect(res.text).toBe('[{},{},{}]');
});


afterAll(() => {
  // https://stackoverflow.com/q/8659011/11262798
  api.server.close();
});
