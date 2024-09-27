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
let admin;

beforeAll(async () => {
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserAuthToken = registerRes.body.token;
  testUserUser = registerRes.body.user;
});

test('get franchise', async () => {
  const franchiseRes = await request(app).get('/api/franchise');
  expect(franchiseRes.status).toBe(200);
});

test('bad endpoint franchise', async () => {
    const franchiseRes = await request(app).get('/api/notfranchise');
    expect(franchiseRes.status).toBe(404);
    expect(franchiseRes.body.message).toMatch("unknown endpoint")
});


test('get users franchise', async () => {
    admin = await createAdminUser();

    const loginRes = await request(app).put('/api/auth').send(admin);
     const tempStr = '/api/franchise/' + loginRes.body.user.id;
     const tempAuth = await loginRes.body.token;
     
    const franchiseRes = await request(app).get(tempStr).set('Authorization', `Bearer ${tempAuth}`);

    expect(franchiseRes.status).toBe(200);
  });

  test('create franchise', async () => {
    admin = await createAdminUser();

    const loginRes = await request(app).put('/api/auth').send(admin);
    const tempAuth = await loginRes.body.token;

    let newFranchise = {name: "replace", admins: [{email: admin.email}]}
    newFranchise.name =randomName();
    newFranchise.admins.email = admin.email;

     
    const franchiseRes = await request(app).post('/api/franchise/').set('Authorization', `Bearer ${tempAuth}`).send(newFranchise);

    expect(franchiseRes.status).toBe(200);
  });

  test('create franchise bad email', async () => {
    admin = await createAdminUser();

    const loginRes = await request(app).put('/api/auth').send(admin);
    const tempAuth = await loginRes.body.token;

    let newFranchise = {name: "replace", admins: [{email: "Not admin email"}]}
    newFranchise.name =randomName();

     
    const franchiseRes = await request(app).post('/api/franchise/').set('Authorization', `Bearer ${tempAuth}`).send(newFranchise);

    expect(franchiseRes.status).toBe(404);
  });

  test('delete franchise', async () => {
    admin = await createAdminUser();

    const loginRes = await request(app).put('/api/auth').send(admin);
    const tempAuth = await loginRes.body.token;

    let newFranchise = {name: "replace", admins: [{email: admin.email}]}
    newFranchise.name =randomName();
    newFranchise.admins.email = admin.email;
    
    const franchiseRes = await request(app).post('/api/franchise/').set('Authorization', `Bearer ${tempAuth}`).send(newFranchise);
    expect(franchiseRes.status).toBe(200);

    const tempStr = '/api/franchise/' + franchiseRes.body.id;
    const deleteeRes = await request(app).delete(tempStr).set('Authorization', `Bearer ${tempAuth}`);
    
    expect(deleteeRes.status).toBe(200);
    expect(deleteeRes.body.message).toBe("franchise deleted");

  });