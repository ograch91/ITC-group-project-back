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
const { login, signUp, updateUser, setUserImage, getUserById, getAllUsers,ping } = require('../controllers/users.controller');
//  const { login, signUp, ping, updateUser, setUserImage} = require('../controllers/users.controller');
const route = express.Router();
const { authanticate } = require('../lib/JWT');
const { userLoginSchema, userDetailSchema, userImageUpdate } = require('../validation/users.schema');
//  const { userLoginSchema, userDetailSchema, userImageUpdate } = require('../validation/users.schema');
const { validateSchema } = require('../validation/validate');

route.post('/login', validateSchema(userLoginSchema), login);
route.post('/signup', validateSchema(userDetailSchema), signUp);
route.put('/update', authanticate, validateSchema(userDetailSchema), updateUser);
route.get('/ping',authanticate, ping);
route.put('/setphoto', authanticate, validateSchema(userImageUpdate), setUserImage);

route.get('/getall', authanticate, getAllUsers);  
route.get('/:id', authanticate, getUserById)  // MUST BE LAST ROUTE

module.exports = route;
