const supertestSession = require('supertest-session');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertestSession(app);

const {
  loginAsAdmin, loginAsNonAdmin1, loginAsNonAdmin2, cleanUp, logout,
  initializeUsers, initializeQuestions, initialQuestions,
} = require('./test_helper')(api);

test('cannot get questions if not logged in', async () => {
  api.get('/api/questions').expect(401, { error: 'unauthorized' });
});

const questionSample = {
  question: 'question',
  choices: {
    a: 'a',
    b: 'b',
    c: 'c',
    d: 'd',
  },
  answer: 'a',
  category: 'esas',
};

describe('logged in as non-admin, ', () => {
  beforeEach(async () => {
    await initializeUsers();
    await initializeQuestions();
    await loginAsNonAdmin1();
  });

  afterEach(async () => {
    await logout();
    await cleanUp();
  });

  test('can get questions', async () => {
    const { body: questions } = await api.get('/api/questions').expect(200);
    expect(questions.length).toBe(initialQuestions.length);
  });

  test('can submit a question', async () => {
    await api.post('/api/questions').send(questionSample).expect(201);
  });

  test('submitted question is initially unapproved', async () => {
    const { body: question } = await api.post('/api/questions').send(questionSample).expect(201);
    const { body: questions } = await api.get('/api/questions');
    expect(questions.find((q) => q.id === question.id)).not.toHaveProperty('approved');
  });

  test('cannot approve a question', async () => {
    const { body: question } = await api.post('/api/questions')
      .send(questionSample).expect(201);
    await api.post(`/api/questions/approve/${question.id}`)
      .expect(401, { error: 'Approving questions requires admin privileges' });
  });

  test('can delete own unapproved question', async () => {
    const { body: question } = await api.post('/api/questions')
      .send(questionSample).expect(201);
    await api.delete(`/api/questions/${question.id}`).expect(204);
  });

  test('cannot delete approved questions', async () => {
    const { body: questions } = await api.get('/api/questions');
    await api.delete(`/api/questions/${questions[0].id}`)
      .expect(401, { error: 'Deleting approved questions require admin privileges' });
  });

  test('cannot delete pending questions submitted by others', async () => {
    const { body: question } = await api.post('/api/questions')
      .send(questionSample).expect(201);
    await logout();
    await loginAsNonAdmin2();
    await api.delete(`/api/questions/${question.id}`)
      .expect(401, { error: 'Deleting pending questions require the deleter to be the submitter or an admin' });
  });

  test('invalid question category is rejected', async () => {
    await api.post('/api/questions')
      .send({ ...questionSample, category: 'hehe' })
      .expect(400, {
        message: 'Invalid request body properties',
        errors: [
          {
            error: 'Invalid category(must be ee, math or esas)',
            value: 'hehe',
          },
        ],
      });
  });

  test('invalid question answer is rejected', async () => {
    await api.post('/api/questions')
      .send({ ...questionSample, answer: 'hehe' })
      .expect(400, {
        message: 'Invalid request body properties',
        errors: [
          {
            error: 'Invalid answer(must be a, b, c, or d)',
            value: 'hehe',
          },
        ],
      });
  });

  test('question with invalid choices is rejected', async () => {
    await api.post('/api/questions')
      .send({ ...questionSample, choices: 'hehe' })
      .expect(400, {
        message: 'Invalid request body properties',
        errors: [
          {
            error: 'Invalid choices',
            value: 'hehe',
          },
        ],
      });
    await api.post('/api/questions')
      .send({ ...questionSample, choices: { a: 'b', g: 'h' } })
      .expect(400, {
        message: 'Invalid request body properties',
        errors: [
          {
            error: 'Invalid choices',
            value: { a: 'b', g: 'h' },
          },
        ],
      });
  });
});

test('An admin can approve pending questions', async () => {
  await initializeUsers();
  await loginAsAdmin();
  const { body: question } = await api.post('/api/questions')
    .send(questionSample).expect(201);
  const { body: approvedQuestion } = await api.post(`/api/questions/approve/${question.id}`).expect(201);
  expect(approvedQuestion).toMatchObject(questionSample);
  await logout();
  await cleanUp();
});

afterAll(() => mongoose.connection.close());
