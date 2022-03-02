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

const login = (api, username, password) => api.post('/api/auth/login')
  .send({ username, password });

const loginAsNonAdmin1 = (api) => login(
  api, nonAdminCredentials1.username, nonAdminCredentials1.password,
);

const loginAsNonAdmin2 = (api) => login(
  api, nonAdminCredentials2.username, nonAdminCredentials2.password,
);

const loginAsAdmin = (api) => login(
  api, adminCredentials.username, adminCredentials.password,
);

const logout = (api) => api.post('/api/auth/logout');

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
  const { body: user } = await loginAsAdmin(api);
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

module.exports = (api) => ({
  initializeUsers,
  nonAdminCredentials1,
  nonAdminCredentials2,
  login: (username, password) => login(api, username, password),
  loginAsNonAdmin1: () => loginAsNonAdmin1(api),
  loginAsNonAdmin2: () => loginAsNonAdmin2(api),
  adminCredentials,
  loginAsAdmin: () => loginAsAdmin(api),
  logout: () => logout(api),
  cleanUp,
  initialQuestions,
  initializeQuestions: () => initializeQuestions(api),
});
