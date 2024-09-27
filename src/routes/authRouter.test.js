jest.setTimeout(60 * 1000 * 5); // 5 minutes
const request = require('supertest');
const app = require('../service');

////////////////////////////////////
const { Role, DB } = require('../database/database.js');

function randomName() {
  return Math.random().toString(36).substring(2, 12);
}

async function createAdminUser() {
  let user = { password: 'toomanysecrets', roles: [{ role: Role.Admin }] };
  user.name = randomName();
  user.email = user.name + '@admin.com';

  await DB.addUser(user);

  user.password = 'toomanysecrets';
  return user;
}
//////////////////////////////////////////////////


const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
const fakeUser = { name: 'fake diner', email: 'fake@fake.com', password: 'b'};
const fakeRegister = { name: 'fake Register'};
let testUserAuthToken;
let testUserUser;
let admin;

beforeAll(async () => {
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserAuthToken = registerRes.body.token;
  testUserUser = registerRes.body.user;
});

test('login', async () => {
  const loginRes = await request(app).put('/api/auth').send(testUser);
  expect(loginRes.status).toBe(200);
  expect(loginRes.body.token).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);

  const { password, ...user } = { ...testUser, roles: [{ role: 'diner' }] };
  expect(loginRes.body.user).toMatchObject(user);
});

test('failed register', async () => {
  const registerRes = await request(app).post('/api/auth').send(fakeRegister);
  expect(registerRes.status).toBe(400);
  expect(registerRes.body.message).toMatch('name, email, and password are required')
});

test('failed login', async () => {
  const fLoginRes = await request(app).put('/api/auth').send(fakeUser);
  expect(fLoginRes.status).toBe(404);
  expect(fLoginRes.body.message).toMatch('unknown user')
});


test('failed logout', async () => {
  const logoutRes = await request(app).delete('/api/auth').send(testUser);
  expect(logoutRes.status).toBe(401);
  expect(logoutRes.body.message).toMatch('unauthorized');
});

test('update user', async () => {

  admin = await createAdminUser();
  let newinfo = { password: 'replaced'};
  newinfo.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  newinfo.password = randomName();

  const loginRes = await request(app).put('/api/auth').send(admin);
  const tempStr = '/api/auth/' + loginRes.body.user.id;
  const tempAuth = await loginRes.body.token;

  const updateRes = await request(app).put(tempStr).set('Content-Type', 'application/json').set('Authorization', `Bearer ${tempAuth}`).send(newinfo);

  expect(updateRes.status).toBe(200);
  expect(updateRes.body.email).toMatch(newinfo.email);
}); 


test('logout', async () => {
  const logoutRes = await request(app).delete('/api/auth').set('Authorization', `Bearer ${testUserAuthToken}`).send(testUser);
  expect(logoutRes.status).toBe(200);
  expect(logoutRes.body.message).toMatch('logout successful');
});


