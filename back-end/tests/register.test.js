const supertestSession = require('supertest-session');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertestSession(app);
const {
  loginAsAdmin, logout, cleanUp, adminCredentials, initializeUsers,
} = require('./test_helper')(api);

test('cannot register with an invalid link', async () => {
  await api.post('/api/register/abc')
    .send({ name: 'name', username: 'username', password: 'password' })
    .expect(401, { error: 'Invalid registration link' });
});

describe('with a valid link, ', () => {
  let link;
  beforeEach(async () => {
    await initializeUsers();
    await loginAsAdmin();
    link = (await api.post('/api/register/add-link')).text;
    await logout();
  });

  afterEach(async () => {
    await logout();
    await cleanUp();
  });

  test('can register', async () => {
    const newUser = await api.post(`/api/register/${link}`)
      .send({ name: 'name', username: 'username', password: 'password' })
      .expect(201);
    expect(newUser.body).toMatchObject({
      username: 'username',
      name: 'name',
      isAdmin: false,
      id: /.+/,
    });
  });

  test('can use the link only once', async () => {
    await api.post(`/api/register/${link}`)
      .send({ name: 'name', username: 'username', password: 'password' })
      .expect(201);
    await logout(api);
    await api.post(`/api/register/${link}`)
      .send({ name: 'newname', username: 'newusername', password: 'newpassword' })
      .expect(401, { error: 'Invalid registration link' });
  });

  test('link is not consumed if unsuccessful registration', async () => {
    await api.post(`/api/register/${link}`)
      .send({ name: 'threpe', username: 'countThrepe' })
      .expect(400);
    await api.post(`/api/register/${link}`)
      .send({ name: 'name', username: 'username', password: 'password' })
      .expect(201);
  });

  test('cannot have missing username, name or password', async () => {
    await api.post(`/api/register/${link}`)
      .send({ name: 'threpe', username: 'countThrepe' })
      .expect(400);
    await api.post(`/api/register/${link}`)
      .send({ username: 'countThrepe', password: 'threpe' })
      .expect(400);
    await api.post(`/api/register/${link}`)
      .send({ name: 'countThrepe', password: 'threpe' })
      .expect(400);
    await api.post(`/api/register/${link}`)
      .send({ username: 'countThrepe' })
      .expect(400);
    await api.post(`/api/register/${link}`)
      .send({ password: 'threpe' })
      .expect(400);
    await api.post(`/api/register/${link}`)
      .send({ name: 'countThrepe' })
      .expect(400);
  });

  test('cannot use a username already taken', async () => {
    await api.post(`/api/register/${link}`)
      .send({ name: adminCredentials.name, username: adminCredentials.username, password: 'asd' })
      .expect(400, { error: 'Username already taken' });
  });

  test('cannot use username and password with invalid lengths', async () => {
    await api.post(`/api/register/${link}`)
      .send({ name: 'a', username: 'b', password: 'c' })
      .expect(400);
  });
});

afterAll(() => { mongoose.connection.close(); });
