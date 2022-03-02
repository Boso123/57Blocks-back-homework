const JWT = require('./JWTController');
const response = require('./standardResponse');

async function validateMiddleware(req, res, next) {
  const header = req.headers; //Check request headers
  const authToken = header.authorization.split(" ");

  if (authToken[0] != 'Bearer') {  //Check token type
    res.status(401).json(response("Token unrachable", 'error', 'BadRequest'))
  }

  const jwt = new JWT();
  await jwt.initializeKeyStore();

  try {
    const information = await jwt.validateKey(authToken[1]); //Validate token
    res.locals.userEmail = information.email;
    next();
  } catch (error) {
    res.status(403).json(response({ message: "Token unrachable", error: error }, 'error', 'Forbidden'));
  }
}

module.exports = validateMiddleware;