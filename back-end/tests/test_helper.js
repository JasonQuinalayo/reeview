const User = require('../mongo/models/user');
const Question = require('../mongo/models/question');

const adminCredentials = {
  username: 'kvothe',
  name: 'kvothe',
  password: 'password',
};

const nonAdminCredentials1 = {
  username: 'ambrose',
  name: 'ambrose',
  password: 'password',
};

const nonAdminCredentials2 = {
  username: 'hemme1',
  name: 'hemme1',
  password: 'password',
};

const initializeUsers = async () => {
  const nonAdmin1 = new User({
    username: nonAdminCredentials1.username,
    name: nonAdminCredentials1.name,
    passwordHash: '$2a$10$FyE1o6anZndkLJAxLEolxuNbMIiTLBgNFFNG57443JYrCcbGymKPG',
    isAdmin: false,
  });
  const nonAdmin2 = new User({
    username: nonAdminCredentials2.username,
    name: nonAdminCredentials2.name,
    passwordHash: '$2a$10$FyE1o6anZndkLJAxLEolxuNbMIiTLBgNFFNG57443JYrCcbGymKPG',
    isAdmin: false,
  });
  const admin = new User({
    username: adminCredentials.username,
    name: adminCredentials.name,
    passwordHash: '$2a$10$FyE1o6anZndkLJAxLEolxuNbMIiTLBgNFFNG57443JYrCcbGymKPG',
    isAdmin: true,
  });
  await admin.save();
  await nonAdmin1.save();
  await nonAdmin2.save();
};

const loginAsNonAdmin1 = async (api) => {
  const login = await api.post('/api/auth/login')
    .send({ username: nonAdminCredentials1.username, password: nonAdminCredentials1.password });
  return login.body;
};

const loginAsNonAdmin2 = async (api) => {
  const login = await api.post('/api/auth/login')
    .send({ username: nonAdminCredentials2.username, password: nonAdminCredentials2.password });
  return login.body;
};

const loginAsAdmin = async (api) => {
  const login = await api.post('/api/auth/login').send({ username: adminCredentials.username, password: adminCredentials.password });
  return login.body;
};

const logout = async (api) => { await api.post('/api/auth/logout'); };

const cleanUp = async () => {
  await User.deleteMany({});
  await Question.deleteMany({});
};

const initialQuestions = [
  {
    question: 'question1',
    choices: {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
    },
    answer: 'b',
    maximumLengthChoice: 1,
    category: 'ee',
    year: 2010,
  },
  {
    question: 'question2',
    choices: {
      a: 'abcdef',
      b: 'b',
      c: 'c',
      d: 'd',
    },
    answer: 'c',
    maximumLengthChoice: 6,
    category: 'ee',
    year: 2010,
  },
  {
    question: 'question3',
    choices: {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
    },
    answer: 'a',
    maximumLengthChoice: 1,
    category: 'ee',
  },
  {
    question: 'question4',
    choices: {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
    },
    answer: 'b',
    maximumLengthChoice: 1,
    category: 'ee',
    year: 2010,
  },
  {
    question: 'question5',
    choices: {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
    },
    answer: 'd',
    maximumLengthChoice: 1,
    category: 'ee',
  },
];

const initializeQuestions = async (api) => {
  const user = await loginAsAdmin(api);
  await initialQuestions.forEach(async (q) => {
    const question = new Question({
      ...q,
      submitted: {
        by: user.id,
        date: (new Date()).toLocaleDateString(),
      },
      approved: {
        by: user.id,
        date: (new Date()).toLocaleDateString(),
      },
    });
    await question.save({ validateBeforeSave: true });
  });
};

const funcWrapper = (fn, ...args) => async () => fn(...args);

module.exports = (api) => ({
  initializeUsers,
  nonAdminCredentials1,
  nonAdminCredentials2,
  loginAsNonAdmin1: funcWrapper(loginAsNonAdmin1, api),
  loginAsNonAdmin2: funcWrapper(loginAsNonAdmin2, api),
  adminCredentials,
  loginAsAdmin: funcWrapper(loginAsAdmin, api),
  logout: funcWrapper(logout, api),
  cleanUp,
  initialQuestions,
  initializeQuestions: funcWrapper(initializeQuestions, api),
});
