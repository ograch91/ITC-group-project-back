// const DbCollection = require('../DBmock/dblocal');
const DbCollection = require('../DB/mongodb');
const { starterPack, mapChatsToUsers, getMessagesPerChat } = require('../services/starter.service');
const { userForFront, getUserById } = require('../services/users.service');
const chats = new DbCollection('chats');

module.exports.allChats = async (req, res, next) => {
  const allChats = await chats.get();
  res.ok(allChats);
};

module.exports.getChatsById = async (req, res, next) => {
  const currentChat = await chats.getById(req.params.id);

  res.ok(currentChat);
};

module.exports.addNewChat = async (req, res, next) => {
  const { id, created, participants } = req.body;
  // const allMessages = await messages.get();
  chats.add({ id, created, participants });
  res.ok('New chats created');
};

// module.exports.allChatsForUser = async (req, res, next) => {
//   const { id } = req.user;
//   const allChats = await chats.get(); // todo: avoid get all, use mongo query functionality
//   const chatsForUser = allChats.filter(chat => chat.participants.includes(id));
//   res.ok(chatsForUser);
// };

module.exports.getFrontStarter = async (req, res, next) => {
  const { id } = req.user;
  const allChats = await chats.get();
  const chatsForUser = allChats.filter(chat => chat.participants.includes(id));
  chatsForUser.forEach(chat => chat._id && delete chat._id);
  // const chatsForUser = chats.findChatsByUserId(id);
  const otherUserDetails = await mapChatsToUsers(chatsForUser, id);
  const messagesPerChat = await getMessagesPerChat(chatsForUser);
  res.ok({
    chats: chatsForUser,
    otherUsers: otherUserDetails,
    messagesPerChat: messagesPerChat,
  });
};
