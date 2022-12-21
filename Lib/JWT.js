const jwt = require('jsonwebtoken');
const { errNoAuth } = require('./responseHandler');
const { getUserByEmail } = require('../services/users.service');

const privateKey = 'secret';

module.exports.generateToken = (payload, expiresIn = '1h') => {
  const token = jwt.sign(payload, privateKey, { expiresIn });
  return token;
};

module.exports.verifyToken = token => {
  try {
    const decoded = jwt.verify(token, privateKey);
    return { decoded, isValid: true };
  } catch (error) {
    return { isValid: false, error };
  }
};

module.exports.authanticate = async (req, res, next) => {
  const token = req.headers.authorization;
  const decodeResult = this.verifyToken(token);
  if (!decodeResult.isValid) {
    return next(errNoAuth());
  }
  const { email } = decodeResult.decoded;
  const user = await getUserByEmail(email);
  if (!user) {
    console.log('user not found', email);
    return next(errNoAuth());
  }

  req.user = user;
  next();
};
