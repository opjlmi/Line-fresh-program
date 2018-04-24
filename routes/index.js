const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(404);
  res.render('error', {});
});

router.get('/line/usage', (req, res) => {
  res.render('lineusage')
})

module.exports = router;
