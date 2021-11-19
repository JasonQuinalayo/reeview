require('dotenv').config();

const { PORT, NODE_ENV } = process.env;

// eslint-disable-next-line no-nested-ternary
const MONGODB_URI = NODE_ENV === 'development'
  ? process.env.DEV_MONGODB_URI
  : NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const FIREBASE_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
  ? process.env.DEV_TEST_FIREBASE_URI
  : process.env.FIREBASE_URI;

module.exports = {
  PORT, MONGODB_URI, FIREBASE_URI, NODE_ENV,
};
