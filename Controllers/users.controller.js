const DbCollection = require('../DB/mongodb');
const { hashPassword, verifyPassword } = require('../Lib/hashPassword');
const { generateToken } = require('../Lib/JWT');
const { ErrNotFound, errExists, ErrRes } = require('../Lib/responseHandler');
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
  const user = await getUserByEmail(email);
  if (!user) {
    return next(ErrNotFound('User not found'));
  }

  const hash = await hashPassword(password);
  const update = await users.updateItem(user.id, {
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

module.exports.setUserImage = async (req, res, next) => {
  const { photo } = req.body;
  const id = req.user.id;
  const updated = await users.updateItem(id, { photo });
  res.ok(userForFront(updated));
};

module.exports.getAllUsers = async (req, res, next) => {
  const usersList = await users.get();
  if (!usersList) {
    return next(ErrNotFound('User not found'));
  }
  res.ok(usersList);
};

module.exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await users.getById(id);
  if (!user) {
    return next(ErrNotFound('User not found'));
  }
  const resp = userForFront(user);
  res.ok(resp);
};

module.exports.ping = (req, res, next) => {
  console.log('ping');
  res.ok({ message: 'token ok' });
};
