// actual endpoint logic/implementation is defined here

const DbCollection = require('../DB/mongodb');
const { hashPassword, verifyPassword } = require('../lib/hashpassword');
const { generateToken } = require('../lib/JWT');
const { ErrNotFound, errExists, ErrRes } = require('../lib/responseHandler');
const {
  getUserByEmail,
  userForFront,
  upgradeUser,
} = require('../services/users.service');
const users = new DbCollection('users');

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return next(ErrNotFound('Invalid email or password'));
  }

  let isCorrect = false;
  if (user.hash) {
    isCorrect = await verifyPassword(password, user.hash);
  } else {
    isCorrect = password === user.password; // todo: remove once using real DB with hash
  }

  if (!isCorrect) {
    return next(ErrNotFound('Invalid email or password'));
  }

  const newToken = generateToken({ email });

  res.ok({ token: newToken, user: userForFront(user) });  
};

module.exports.signUp = async (req, res, next) => {
  const { email, password, name, phone } = req.body;
  const user = await getUserByEmail(email);

  if (user) {
    return next(errExists('User already exists'));
  }
  const hash = await hashPassword(password);
  users.add({ email, hash, name, phone, passDebug: password });
  // passDebug is for debugging only, remove in production
  res.ok({ message: 'User created successfully' });
};

module.exports.updateUser = async (req, res, next) => {
  const { email, password, name, phone } = req.body;
  const user = getUserByEmail(email);
  if (!user) {
    return next(ErrNotFound('User not found'));
  }

  const hash = await hashPassword(password);
  const update = users.updateItem(user.id, {
    email,
    hash,
    name,
    phone,
    passDebug: password,
  });

  res.ok({
    message: 'User updated successfully',
    user: userForFront(update),
  });
};
