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

router.get('/db/collection', async function (req, res, next) {
  var jwt = new JWT();
  await jwt.initializeKeyStore();
  try {
    var data = await jwt.validateKey("eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjdHQWlJRnE2Vml2OF85U0pvQVR5Tkk5Q0hpZVlYU0JEaFFzZVIzY2cybVEifQ.eyJleHAiOjE2NDYxMDY5MDEsImlhdCI6MTY0NjEwNjg0MSwic3ViIjoiUHJ1ZWJhIn0.BCi7R6b7zb0Kw2fqI7gE3luiHCaF8CMe6mSMMESC5DwpWAUFTsTBIzpHOQkx3HnZ1KXoYs3K6mfxJMz2Is0DCC-0_FZFm_kDvkIqCqHklwOHJdLyfWFGjKAoArpajcNQl4f233C0a3A0dQzQZp2V1fIIHW4i_G5LNZCLAuC9k3AxKabhsoJJwTeBv881XWSJfDmhswj695hIqm4UVgQhGMYfEoIxtZe4qSmCSzGyhNfqKJ9Or_F_LKj6iNDG9A8wTrfqqWYjttf_w8rStG3Vjw3QgMkLphYWQ1uKnPukHEkqfSZ0LNevHzbghq17yist33mVyPu50A-GE9KiAZCzkQ")
    res.status(200).json(response(data, "success", "response"));
  } catch (error) {
    res.status(400).json(response(error, "error", "Bad"));
  }
});

module.exports = router;
