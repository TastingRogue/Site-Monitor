var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/americas', function(req, res, next){
	res.render('americas');
});

module.exports = router;
