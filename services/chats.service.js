const DbCollection = require('../DB/mongodb');
const chats = new DbCollection('chats');

module.exports.getChatsById = async (chatId) => {
  return await chats.getById(chatId);
  
};