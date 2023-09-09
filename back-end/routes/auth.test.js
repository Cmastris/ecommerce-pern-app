const request = require('supertest');
const api = require('../index');

// https://jestjs.io/docs/manual-mocks
jest.mock('../db/index');

// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

test('GET /auth/register returns a 404 status code', async () => {
   const res = await request(api).get('/auth/register');
   expect(res.statusCode).toBe(404);
});

test('POST /auth/register with missing data returns a 500 status code', async () => {
  const res = await request(api).post('/auth/register').send({});
  expect(res.statusCode).toBe(500);
});

test('POST /auth/register with an existing username returns a 400 status code', async () => {
  const res = await request(api).post('/auth/register').send(
    { username: "usernameExists", password: "pw" }
  );
  expect(res.statusCode).toBe(400);
});

test('POST /auth/register with a new username returns a success response', async () => {
  const res = await request(api).post('/auth/register').send(
    { username: "newUsername", password: "pw" }
  );

  expect(res.statusCode).toBe(201);
  expect(res.body).toStrictEqual({ id: 1, username: "newUsername" });
});

test('GET /auth/login returns a 404 status code', async () => {
  const res = await request(api).get('/auth/login');
  expect(res.statusCode).toBe(404);
});

afterAll(() => {
  // https://stackoverflow.com/q/8659011/11262798
  api.server.close();
});
