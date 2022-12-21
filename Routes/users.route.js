const express = require('express');
const connections = require('../Lib/activeConnections').getList();

const {
  login,
  signUp,
  updateUser,
  setUserImage,
  getUserById,
  getAllUsers,
  ping,
} = require('../Controllers/users.controller');
const route = express.Router();
const { authanticate } = require('../Lib/JWT');

const {
  userLoginSchema,
  userDetailSchema,
  userImageUpdate,
} = require('../Validation/users.schema');
const { validateSchema } = require('../Validation/validate');
const {
  sessionsByUserId,
  clearDeadSessions,
  sendToSessions,
  SessionHolder,
} = require('../services/sessions.service');

route.post('/wstest', authanticate, (req, res) => {
  const sessions = new SessionHolder(connections);
  const userId = req.user.id;
  sessions.clearDeadSessions();
  const currentUserSes = sessions.sessionsByUserId(userId);
  const dataToSend = { target: 'test', data: 'test' };
  sendToSessions(currentUserSes, dataToSend);
  res.send('ok');
});

route.post('/login', validateSchema(userLoginSchema), login);
route.post('/signup', validateSchema(userDetailSchema), signUp);

route.put(
  '/update',
  authanticate,
  validateSchema(userDetailSchema),
  updateUser
);
route.get('/ping', authanticate, ping);
route.put(
  '/setphoto',
  authanticate,
  validateSchema(userImageUpdate),
  setUserImage
);
route.get('/getall', authanticate, getAllUsers);
route.get('/:id', authanticate, getUserById); // MUST BE LAST ROUTE

module.exports = route;
