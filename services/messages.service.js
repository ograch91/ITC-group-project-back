const DbCollection = require('../DB/mongodb');
const { SessionHolder, sendToSessions } = require('./sessions.service');
const messages = new DbCollection('messages');
const chats = new DbCollection('chats');
const connections = require('../Lib/activeConnections').getList();

module.exports.getByChatId = async chatId => {
  const chatMessages = await messages.getByFilterEQ('chatid', chatId);
  const sortedMessages = chatMessages.sort((a, b) => a.datesent - b.datesent);
  return sortedMessages;
};

module.exports.distributeNewMessage = async (chatId, newMessage) => {
  const chat = await chats.getById(chatId);
  const { participants } = chat;

  const holder = new SessionHolder(connections);

  participants.forEach(async userId => {
    const userSessions = holder.sessionsByUserId(userId);
    sendToSessions(userSessions, newMessage);
  });
};
