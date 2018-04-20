const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(404);
  res.render('error', {});
});

router.post('/linewebhook-dlfkru', (req, res) => {
  console.log(req.body)
  res.send('ok')
})

module.exports = router;
