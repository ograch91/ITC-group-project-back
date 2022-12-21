const DbCollection = require('../DB/mongodb');
const {
  starterPack,
  mapChatsToUsers,
  getMessagesPerChat,
} = require('../services/starter.service');
const { userForFront, getUserById } = require('../services/users.service');
const chats = new DbCollection('chats');
const { v4: uuidv4 } = require('uuid');
const { ErrRes, ErrNotFound } = require('../lib/responseHandler');
const { distributeNewEvent } = require('../services/sessions.service');

module.exports.allChats = async (req, res, next) => {
  const allChats = await chats.get();
  res.ok(allChats);
};

module.exports.getChatsById = async (req, res, next) => {
  const currentChat = await chats.getById(req.params.id);
  if (!currentChat) {
    return next(ErrNotFound('Chat not found'));
  }
  res.ok(currentChat);
};

module.exports.addNewChat = async (req, res, next) => {
  const { created, participants } = req.body;
  const chatParts = req.validatedParticipants;
  const newChat = { created, participants: chatParts };
  console.log('newChat', newChat);
  const newChatDb = await chats.add(newChat);
  distributeNewEvent(chatParts, newChatDb, 'newChat');
  res.ok({ message: 'New chats created', createdId: newChatDb.id });
};

module.exports.validateParticipants = async (req, res, next) => {
  const { participants } = req.body;
  const curUserId = req.user.id;

  const uniqueParticipants = [...new Set(participants)];
  if (uniqueParticipants.length < 2) {
    return next(ErrRes('Chat must have at least 2 participants'));
  }
  if (!uniqueParticipants.includes(curUserId)) {
    return next(ErrRes('Chat must include current user'));
  }
  //todo: remove after adding groups
  if (uniqueParticipants.length !== 2) {
    return next(ErrRes('Groups are not supported yet'));
  }
  for (let userId of uniqueParticipants) {
    const user = await getUserById(userId);
    if (!user) {
      return next(ErrNotFound(`User with id ${userId} does not exist`));
    }
  }
  req.validatedParticipants = uniqueParticipants;
  next();
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
