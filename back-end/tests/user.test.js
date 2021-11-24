const supertestSession = require('supertest-session');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertestSession(app);
const {
  initializeUsers, loginAsNonAdmin1, logout, nonAdminCredentials1, cleanUp,
} = require('./test_helper')(api);

test('cannot get user data if not logged in', async () => {
  await api.get('/api/user').expect(401);
});

describe('a logged in user', () => {
  beforeEach(async () => {
    await cleanUp();
    await initializeUsers();
    await loginAsNonAdmin1();
  });

  afterEach(async () => {
    await logout();
  });

  afterAll(async () => {
    await cleanUp();
  });

  const userObj = {
    username: nonAdminCredentials1.username, name: nonAdminCredentials1.name, id: /.+/, isAdmin: false,
  };

  test('can get his/her info', async () => {
    const user = await api.get('/api/user').expect(200);
    expect(user.body).toMatchObject(userObj);
  });

  test('can change password', async () => {
    let user = await api.post('/api/user/change-password')
      .send({ password: nonAdminCredentials1.password, newPassword: 'newPassword' })
      .expect(200);
    expect(user.body).toMatchObject(userObj);
    await api.post('/api/auth/logout').expect(204);
    await api.post('/api/auth/login')
      .send({ username: nonAdminCredentials1.username, password: nonAdminCredentials1.password })
      .expect(401, { error: 'Invalid username or password' });
    user = await api.post('/api/auth/login')
      .send({ username: nonAdminCredentials1.username, password: 'newPassword' })
      .expect(200);
    expect(user.body).toMatchObject(userObj);
  });
});

afterAll(() => mongoose.connection.close());
