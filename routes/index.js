const response = require('../util/standardResponse');
const Mongo = require('../util/mongoConnection');
const JWT = require('../util/JWTController')

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/status', function (req, res, next) {
  res.json(response("working", "success", "Server_info"));
});

router.get('/db/status', function (req, res, next) {
  new Mongo();
  res.status(201).send();
});

module.exports = router;
