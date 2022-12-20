const DbCollection = require('../DB/mongodb');
const { distributeNewMessage } = require('../services/messages.service');
const messages = new DbCollection('messages');
const { v4: uuidv4 } = require('uuid');

module.exports.allMessages = async (req, res, next) => {
  const allMessages = await messages.get();
  res.ok(allMessages);
};

module.exports.getMessagesById = async (req, res, next) => {
  const selectMessages = await messages.getById(req.params.id);
  res.ok(selectMessages);
};

module.exports.getMessagesByChatId = async (req, res, next) => {
  const { id } = req.params;
  const selectMessages = await messages.getByFilterEQ('chatid', id);
  selectMessages.sort((a, b) => a.id - b.id);
  res.ok(selectMessages);
};

module.exports.addNewMessage = async (req, res, next) => {
  const { sender, chatid, datesent, content } = req.body;
  const id = uuidv4();
  const newMessage = { sender, chatid, datesent, content, id }
  messages.add(newMessage);
  console.log(newMessage);
  distributeNewMessage(chatid, newMessage);
  res.ok('New messages created');
};
