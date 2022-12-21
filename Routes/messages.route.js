const express = require('express');
const route = express.Router();
const {
  allMessages,
  getMessagesById,
  addNewMessage,
  getMessagesByChatId,
} = require('../Controllers/messages.controller');
const { authanticate } = require('../Lib/JWT');
const { messagesSchema } = require('../Validation/messages.schema');
const { validateSchema } = require('../Validation/validate');

route.get('/getall', allMessages);
route.get('/getChat/:id', getMessagesByChatId);
route.post('/', authanticate, validateSchema(messagesSchema), addNewMessage);
route.get('/:id', getMessagesById);

module.exports = route;
