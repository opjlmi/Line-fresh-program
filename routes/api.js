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

// Routers
router.get('/', (req, res, next) => {
  res.status(404);
  res.render('error', {});
});

router.post('/linewebhook-dlfkru', (req, res) => {
  // console.log(JSON.stringify(req.body, undefined, 2));
  Promise
    .all(req.body.events.map(handleLineMsgs))
    .then(
      (result) => res.json(result)
    );
})

function handleLineMsgs(e) {
  return new Promise(async (resolve, reject) => {
  })
}


module.exports = router;
