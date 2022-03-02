var express = require('express');
var router = express.Router();
const Mongo = require('../util/mongoConnection');
const response = require('../util/standardResponse')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const userEmail = res.locals.userEmail;

  const mongo = new Mongo();

  var user = await mongo.find('user',{email: userEmail});
  user = user[0];

  res.status(200).json(response({
    email: user.email,
    lastConnection: user.lastConnection
  }, 'success', 'retrived'));
});

module.exports = router;
