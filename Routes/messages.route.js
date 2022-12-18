const express = require('express');
const route = express.Router();
const { allMessages, getMessagesById, addNewMessage ,getMessagesByChatId } = require('../Controllers/messages.controller');
const { authanticate } = require('../Lib/JWT');
const { messagesSchema } = require('../Validation/messages.schema');
const { validateSchema } = require('../validation/validate');


route.get('/getall', allMessages);
route.get('/:id', getMessagesById);
route.get('/getChat/:id', getMessagesByChatId);
route.post('/',authanticate, validateSchema(messagesSchema), addNewMessage);

module.exports = route;
