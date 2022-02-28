const response = require('../util/standardResponse');
const Mongo = require('../util/mongoConnection');

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

router.get('/db/collection', async function (req, res, next) {
  var mongo = new Mongo();
  var data = await mongo.find('pokemon', {name: 'Pikachu'});
  res.status(200).json(response(data, "success", "response"));
});

module.exports = router;
