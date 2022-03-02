const supertestSession = require('supertest-session');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertestSession(app);
const {
  initializeUsers, nonAdminCredentials1, adminCredentials, cleanUp,
} = require('./test_helper')(api);

const baseUrl = '/api/auth';

test('can log in and logout', async () => {
  await initializeUsers();
  const { body: user } = await api.post(`${baseUrl}/login`)
    .send({ username: nonAdminCredentials1.username, password: nonAdminCredentials1.password })
    .expect(200);
  expect(user).toMatchObject({
    username: nonAdminCredentials1.username,
    name: nonAdminCredentials1.name,
    id: /.+/,
    isAdmin: false,
  });
  await api.post(`${baseUrl}/logout`).expect(204);
  const { body: user2 } = await api.post(`${baseUrl}/login`)
    .send({ username: adminCredentials.username, password: adminCredentials.password })
    .expect(200);
  expect(user2).toMatchObject({
    username: adminCredentials.username,
    name: adminCredentials.name,
    id: /.+/,
    isAdmin: true,
  });
  await cleanUp();
});

afterAll(() => mongoose.connection.close());
