const firebase = require('express').Router();
// eslint-disable-next-line import/no-unresolved
const firebaseAdmin = require('firebase-admin');

const { firebaseConfig } = require('../utils/config');

firebaseAdmin.initializeApp({ credentials: firebaseAdmin.applicationDefault });

firebase.get('/token', async (req, res) => {
  const token = await firebaseAdmin.getAuth().createCustomToken(req.session.user.id);
  res.send(token);
});

firebase.get('/config', async (req, res) => {
  res.send(firebaseConfig);
});

module.exports = firebase;
