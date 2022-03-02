const response = require('../util/standardResponse');
const Mongo = require('../util/mongoConnection');

var express = require('express');
const Request = require('request');
const logger = require('../util/logger/logger');
var router = express.Router();

/* GET home page. */
router.get('/status', function (req, res, next) {
  res.json(response("working", "success", "Server_info"));
});

router.get('/db/status', function (req, res, next) {
  new Mongo();
  res.status(201).send();
});

router.get('/random', async function (req, res, next) {
  logger.info("Asking random.org");
  var request = Request('https://www.random.org/integers/?num=1&min=1&max=100&col=5&base=10&format=plain&rnd=new', (err, _res, body) => {
    if (err) {
      res.status(500);
      return;
    }

    res.status(200).send(response(body, 'success', 'random'))
  });

});

module.exports = router;
