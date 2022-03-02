const firebase = require('express').Router();
// eslint-disable-next-line import/no-unresolved
const { initializeApp, applicationDefault } = require('firebase-admin/app');
// eslint-disable-next-line import/no-unresolved
const { getAuth } = require('firebase-admin/auth');

const { firebaseConfig } = require('../utils/config');

initializeApp({ credentials: applicationDefault() });

firebase.get('/token', async (req, res) => {
  const token = await getAuth().createCustomToken(req.session.user.id);
  res.send(token);
});

firebase.get('/config', async (req, res) => {
  res.send(firebaseConfig);
});

module.exports = firebase;
