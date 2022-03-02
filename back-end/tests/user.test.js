const supertestSession = require('supertest-session');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertestSession(app);
const {
  initializeUsers, loginAsNonAdmin1, loginAsNonAdmin2, loginAsAdmin,
  login, logout, adminCredentials, nonAdminCredentials1, cleanUp,
} = require('./test_helper')(api);

const baseUrl = '/api/user';

test('cannot get user data if not logged in', async () => {
  await api.get(baseUrl).expect(401);
});

describe('a logged in user', () => {
  let user;

  beforeEach(async () => {
    await initializeUsers();
    user = (await loginAsNonAdmin1()).body;
  });

  afterEach(async () => {
    await logout();
    await cleanUp();
  });

  const userObj = {
    username: nonAdminCredentials1.username, name: nonAdminCredentials1.name, id: /.+/, isAdmin: false,
  };

  test('can get his/her info', async () => {
    const { body: info } = await api.get(baseUrl).expect(200);
    expect(info).toMatchObject(userObj);
  });

  test('can change password', async () => {
    let response = await api.post(`${baseUrl}/change-password`)
      .send({ password: nonAdminCredentials1.password, newPassword: 'newPassword' })
      .expect(200);
    expect(response.body).toMatchObject(userObj);
    await logout();
    await login(nonAdminCredentials1.username, nonAdminCredentials1.password)
      .expect(401, { error: 'Invalid username or password' });
    response = await login(nonAdminCredentials1.username, 'newPassword')
      .expect(200);
    expect(response.body).toMatchObject(userObj);
  });

  test('can get admins names', async () => {
    const { body: admins } = await api.get(`${baseUrl}/admins`).expect(200);
    expect(admins.length).toBe(1);
    expect(admins[0]).toMatchObject({ name: adminCredentials.name });
  });

  test('cannot get all users list', async () => {
    await api.get(`${baseUrl}/all`).expect(401, { error: 'Getting all users requires admin privileges' });
  });

  test('cannot promote himself/herself', async () => {
    await api.post(`${baseUrl}/promote/${user.id}`).expect(401, { error: 'Promoting users requires admin privileges' });
  });

  test('cannot promote other users', async () => {
    await logout();
    await loginAsNonAdmin2();
    await api.post(`${baseUrl}/promote/${user.id}`).expect(401, { error: 'Promoting users requires admin privileges' });
  });
});

describe('logged in as admin, ', () => {
  beforeEach(async () => {
    await initializeUsers();
    await loginAsAdmin();
  });

  afterEach(async () => {
    await logout();
    await cleanUp();
  });

  test('can get all users list', async () => {
    const { body: users } = await api.get(`${baseUrl}/all`).expect(200);
    expect(users.length).toBe(3);
  });

  test('can promote users', async () => {
    await logout();
    const { body: user } = await loginAsNonAdmin1();
    await logout();
    await loginAsAdmin();
    const { body: updatedUser } = await api.post(`${baseUrl}/promote/${user.id}`).expect(201);
    expect(updatedUser).toMatchObject({ name: nonAdminCredentials1.name, id: /.+/, isAdmin: true });
  });
});

afterAll(() => mongoose.connection.close());
