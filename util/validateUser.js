const JWT = require('./JWTController');
const response = require('./standardResponse');

async function validateMiddleware(req, res, next) {
  const header = req.headers;
  const authToken = header.authorization.split(" ");

  if (authToken[0] != 'Bearer') {
    res.status(401).json(response("Token unrachable", 'error', 'BadRequest'))
  }

  const jwt = new JWT();
  await jwt.initializeKeyStore();

  try {
    const information = await jwt.validateKey(authToken[1]);
    req.userEmail = information.email;
    next();
  } catch (error) {
    res.status(403).json(response("Token unrachable", 'error', 'Forbidden'));
  }
}

module.exports = validateMiddleware;