require('dotenv').config();

const {
  PORT,
  NODE_ENV,
  FIREBASE_API_KEY: apiKey,
  FIREBASE_AUTH_DOMAIN: authDomain,
  FIREBASE_PROJECT_ID: projectId,
  FIREBASE_STORAGE_BUCKET: storageBucket,
  FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  FIREBASE_APP_ID: appId,
} = process.env;

// eslint-disable-next-line no-nested-ternary
const MONGODB_URI = NODE_ENV === 'development'
  ? process.env.DEV_MONGODB_URI
  : NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

module.exports = {
  PORT, MONGODB_URI, firebaseConfig,
};
