const express = require('express');
const route = express.Router();
const {
  allChats,
  getChatsById,
  addNewChat,
  allChatsForUser,
  getFrontStarter,
  validateParticipants,
} = require('../Controllers/chats.controller');
const { authanticate } = require('../lib/JWT');
const { startChatSchema } = require('../Validation/chats.schema');
const { validateSchema } = require('../validation/validate');

route.get('/getall', allChats);
route.get('/starterpack', authanticate, getFrontStarter);
route.post(
  '/startchat',
  authanticate,
  validateSchema(startChatSchema),
  validateParticipants,
  addNewChat
);
route.get('/:id', authanticate, getChatsById);

module.exports = route;
