require('dotenv').config();

const { PORT, NODE_ENV } = process.env;

const MONGODB_URI = NODE_ENV === 'test' || NODE_ENV === 'development'
  ? process.env.DEV_TEST_MONGODB_URI
  : process.env.MONGODB_URI;

const FIREBASE_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
  ? process.env.DEV_TEST_FIREBASE_URI
  : process.env.FIREBASE_URI;

module.exports = {
  PORT, MONGODB_URI, FIREBASE_URI, NODE_ENV,
};
