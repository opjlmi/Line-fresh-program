const express = require('express');
const router = express.Router();
const _wit = require('node-wit');
const _line = require('@line/bot-sdk');
const _translate = require('@google-cloud/translate');
const key = require('../webhookkeys');

// Key Cofigure
const wit = new _wit.Wit({
  accessToken: key.witai.key,
});

const line = new _line.Client({
  channelAccessToken: key.line.channelAccessToken,
  channelSecret: key.line.channelSecret,
});

const translate = new _translate({
  key: key.translate.key,
});

router.get('/', (req, res, next) => {
  res.status(404);
  res.render('error', {});
});

router.post('/linewebhook-dlfkru', (req, res) => {
  console.log(req.body)
  res.send('ok')
})

module.exports = router;
