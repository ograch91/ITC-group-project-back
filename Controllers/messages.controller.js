const DbCollection = require('../DB/mongodb');
const messages = new DbCollection('messages');
const { distributeNewEvent } = require('../services/sessions.service');
const { getChatsById } = require('../services/chats.service');
const { ErrNotFound } = require('../Lib/responseHandler');

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

  const currentChat = await getChatsById(chatid);
  if (!currentChat) {
    return next(ErrNotFound('Chat not found'));
  }
  const participants = currentChat.participants;
  const newMessage = { sender, chatid, datesent, content };
  const newMsgDb = await messages.add(newMessage);
  distributeNewEvent(participants, newMsgDb, 'newMessage');
  res.ok('New messages created');
};
