const DbCollection = require('../DB/mongodb');
const messages = new DbCollection('messages');

module.exports.getByChatId = async chatId => {
  const chatMessages = await messages.getByFilterEQ('chatid', chatId);
  const sortedMessages = chatMessages.sort((a, b) => a.datesent - b.datesent);
  return sortedMessages;
};




