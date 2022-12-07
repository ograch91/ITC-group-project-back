
const express = require('express');
const route = express.Router();
const { allChats, getChatsById, addNewChat } = require('../Controllers/chats.controller');

route.get('/getall', allChats)
route.get('/:id', getChatsById)
route.post('/', addNewChat)



module.exports = route;
