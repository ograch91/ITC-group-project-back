const express = require('express');
const route = express.Router();
const {
  allChats,
  getChatsById,
  addNewChat,
  allChatsForUser,
} = require('../Controllers/chats.controller');
const { authanticate } = require('../lib/JWT');

route.get('/getall', allChats);
route.get('/getbyuser', authanticate, allChatsForUser);
route.post('/', addNewChat);
route.get('/:id', getChatsById);

module.exports = route;
