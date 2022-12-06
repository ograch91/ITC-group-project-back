/**
 * ENDPOINTS:
 * start conversation (single/group)
 * get conversation
 * get all conversations
 * send message
 * get messages
 * delete conversation
 * delete message?
 */
// const DbCollection = require('../DBmock/dblocal');
// const messages = new DbCollection('messages');

const express = require('express');
const route = express.Router();
const { allMessages, getMessagesById } = require('../Controllers/messages.controller');


route.get('/getall', allMessages);
route.get('/:id', getMessagesById)

module.exports = route;
