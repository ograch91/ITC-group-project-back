/**
 * ENDPOINTS:
 * login
 * signup
 * search users
 * get user
 * update user
 * delete user?
 */

const express = require('express');
const {
  login,
  signUp,
  updateUser,
  setUserImage,
  getUserById,
  getAllUsers,
  ping,
} = require('../controllers/users.controller');
//  const { login, signUp, ping, updateUser, setUserImage} = require('../controllers/users.controller');
const route = express.Router();
const { authanticate } = require('../lib/JWT');
const users = require('../Lib/websock');
const {
  userLoginSchema,
  userDetailSchema,
  userImageUpdate,
} = require('../validation/users.schema');
//  const { userLoginSchema, userDetailSchema, userImageUpdate } = require('../validation/users.schema');
const { validateSchema } = require('../validation/validate');

route.get('/wstest', (req, res) => {
  [...users.cons]
    // .filter(u => u.user.email == user.email)
    .forEach(u => u.ws.send('recieved' + u.user.email));
  console.log(users);
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
// Authentication bybassed for /getAllUsers for dev porpuses untill fix to work with authenticate
route.get('/getall', /*authanticate, */ getAllUsers);
route.get('/:id', authanticate, getUserById); // MUST BE LAST ROUTE

module.exports = route;
