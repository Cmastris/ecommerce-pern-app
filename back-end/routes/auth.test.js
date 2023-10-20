const request = require('supertest');
const api = require('../index');

// https://jestjs.io/docs/manual-mocks
jest.mock('../db/index');

// https://github.com/ladjs/supertest
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

test('GET /auth/status returns a 200 status code', async () => {
  const res = await request(api).get('/auth/status');
  expect(res.statusCode).toBe(200);
});

test('GET /auth/register returns a 404 status code', async () => {
   const res = await request(api).get('/auth/register');
   expect(res.statusCode).toBe(404);
});

test('POST /auth/register with missing data returns a 500 status code', async () => {
  const res = await request(api).post('/auth/register').send({});
  expect(res.statusCode).toBe(500);
});

test('POST /auth/register with an existing email returns a 400 status code', async () => {
  const res = await request(api).post('/auth/register').send(
    { email_address: "emailExists@example.com", password: "pw" }
  );
  expect(res.statusCode).toBe(400);
});

test('POST /auth/register with a new email returns a success response', async () => {
  const res = await request(api).post('/auth/register').send(
    { email_address: "newEmail@example.com", password: "pw" }
  );

  expect(res.statusCode).toBe(201);
  expect(res.body).toStrictEqual({ id: 1, email_address: "newEmail@example.com" });
});

test('GET /auth/login returns a 404 status code', async () => {
  const res = await request(api).get('/auth/login');
  expect(res.statusCode).toBe(404);
});

test('POST /auth/login with missing data returns a 400 status code', async () => {
  const res = await request(api).post('/auth/login').send({});
  expect(res.statusCode).toBe(400);
});

test('POST /auth/login with incorrect data returns a 401 status code', async () => {
  const res = await request(api).post('/auth/login').send({
    "username": "emailExists@example.com",
    "password": "wrongpw"
  });
  expect(res.statusCode).toBe(401);
});

test('POST /auth/login with correct data returns a success response', async () => {
  const res = await request(api).post('/auth/login').send({
    "username": "emailExists@example.com",
    "password": "pw"
  });

  expect(res.statusCode).toBe(200);
  expect(res.body).toStrictEqual({
    id: 1,
    email_address: "emailExists@example.com",
    auth_method: "local"
  });
});

afterAll(() => {
  // https://stackoverflow.com/q/8659011/11262798
  api.server.close();
});
