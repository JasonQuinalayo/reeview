const supertestSession = require('supertest-session');
const mongoose = require('mongoose');
const User = require('../mongo/models/user');
const app = require('../app');

const api = supertestSession(app);

test('cannot get user data if not logged in', async () => {
  await api.get('/api/user').expect(401);
});

describe('a logged in user', () => {
  beforeEach(async () => {
    const user = new User({
      username: 'kvothe', name: 'kvothe', passwordHash: '$2a$10$FyE1o6anZndkLJAxLEolxuNbMIiTLBgNFFNG57443JYrCcbGymKPG', isAdmin: true,
    });
    await user.save();
    await api.post('/api/auth/login').send({ username: 'kvothe', password: 'password' });
  });

  test('can change password', async () => {
    await api.post('/api/user/change-password')
      .send({ password: 'password', newPassword: 'newPassword' })
      .expect(200);
    await api.post('/api/auth/logout');
    await api.post('/api/auth/login')
      .send({ username: 'kvothe', password: 'newPassword' })
      .expect(200);
  });
});

afterAll(() => { mongoose.connection.close(); });
