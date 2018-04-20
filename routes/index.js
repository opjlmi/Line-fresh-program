const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(404);
  res.render('error', {});
});

module.exports = router;
