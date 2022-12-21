const { getByChatId } = require('./messages.service');
const { getUserById, userForFront } = require('./users.service');

module.exports.mapChatsToUsers = async (chats, currentUserId) => {
  //get all participants from chats
  const participantsPerChat = chats.map(chat => chat.participants);
  const otherParts = participantsPerChat
    .flat() //flatten arrays
    .filter(participant => participant !== currentUserId); //remove current user

  const otherPartsNoDups = [...new Set(otherParts)]; //clear duplicates from otherParticipants

  //get user details for all other participants (arr of promises)
  const promiseArrOtherUsers = otherPartsNoDups.map(async id => {
    console.log('id', id);
    const user = await getUserById(id);
    if(!user) return {id, name: 'deleted user'};
    return userForFront(user);
  });
 
  //wait for all promises to resolve
  const otherUserDetails = await Promise.all(promiseArrOtherUsers);
  return otherUserDetails;
};

module.exports.getMessagesPerChat = async chats => {
  const fromChatToId = chats.map(chat => chat.id);
  const promiseArrChatToMsg = fromChatToId.map(async id => {
    const MsgPerChat = await getByChatId(id);
    return { chatId: id, messages: MsgPerChat };
  });
  const fromChatToMessages = await Promise.all(promiseArrChatToMsg);
  return fromChatToMessages;
};
