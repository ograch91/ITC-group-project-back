
const express = require('express');
const route = express.Router();
const { allChats, getChatsById } = require('../Controllers/chats.controller');

route.get('/getall', allChats)
route.get('/:id', getChatsById)


module.exports = route;
