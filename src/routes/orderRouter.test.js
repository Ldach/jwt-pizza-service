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
let testUserAuthToken;
let testUserUser;

beforeAll(async () => {
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserAuthToken = registerRes.body.token;
  testUserUser = registerRes.body.user;
});

test('get menu', async () => {
  const menuRes = await request(app).get('/api/order/menu');
  expect(menuRes.status).toBe(200);
});


test('get orders', async () => {
    const logoutRes = await request(app).get('/api/order').set('Authorization', `Bearer ${testUserAuthToken}`).send(testUser);
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.dinerId).toBe(testUserUser.id);
  });

  test('create order', async () => {
    const testOrder = {franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: "Veggie", price: 0.05 }]};
    const logoutRes = await request(app).post('/api/order').set('Content-Type', 'application/json').set('Authorization', `Bearer ${testUserAuthToken}`).send(testOrder);
    expect(logoutRes.status).toBe(200);
  });

