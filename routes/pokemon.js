var express = require('express');
var router = express.Router();
const Mongo = require('../util/mongoConnection');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:userId', function(req, res, next) {

});

router.post('/add', function(req, res, next) {

});

router.put('/update/:userId', function(req, res, next) {

});

router.delete('/remove/:userId', function(req, res, next) {

});

module.exports = router;
