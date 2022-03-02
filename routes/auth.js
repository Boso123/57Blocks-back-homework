var express = require('express');
const response = require('../util/standardResponse');
var router = express.Router();
const Mongo = require('../util/mongoConnection');
const JWT = require('../util/JWTController');


const validateUser = (data) => {
  //Validation of the fields
  if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(data.email)) {
    return response("Email is not valid", "error", "invalidEmail")
  }

  if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{10,}$/).exec(data.password)) {
    return response("Password is not valid", "error", "invalidEmail");
  }
}

/* GET users listing. */
router.post('/register', async function (req, res, next) {
  const data = req.body;

  const validation = validateUser(data);

  if (validation) {
    res.status(400).json(validation);
    return;
  }

  const mongo = new Mongo();
  var userExists = await mongo.find('user', { email: data.email });

  if (userExists.length > 0) {
    res.status(400).json(response("User already exists", 'error', 'userExists'));
    return;
  }


  const user = await mongo.create('user', data);
  const jwt = new JWT();
  await jwt.initializeKeyStore();
  const token = await jwt.signingUser(user);
  res.status(200).json(response({
    token: token,
    email: user.email,
  }, 'success', 'userRegisted'));
});

router.post('/login', async function (req, res, next) {
  const data = req.body;

  const validation = validateUser(data);

  if (validation) {
    res.status(400).json(validation);
    return;
  }

  const mongo = new Mongo();
  var userExists = await mongo.find('user', { email: data.email, password: data.password });

  if (userExists.length == 0) {
    res.status(404).json(response("User not found, verify the email and password", 'error', 'userNotExists'));
    return;
  }

  const jwt = new JWT();
  await jwt.initializeKeyStore();
  const token = await jwt.signingUser(userExists[0]);
  res.status(200).json(response({
    token: token,
    email: userExists[0].email,
  }, 'success', 'userAuth'));
});

module.exports = router;