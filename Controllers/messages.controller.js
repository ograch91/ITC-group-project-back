// // actual endpoint logic/implementation is defined here

// const { ErrNotFound, errExists, ErrRes } = require('../lib/responseHandler');
const DbCollection = require('../DB/mongodb');
const messages = new DbCollection('messages');


module.exports.allMessages = async (req, res, next) => {
  const allMessages = await messages.get();
  res.ok(allMessages);
};

module.exports.getMessagesById = async (req, res, next) => {
  const selectMessages = await messages.getById(req.params.id);
  res.ok(selectMessages);
}

module.exports.getMessagesByChatId = async (req, res, next) => {
  const {id} = req.params;
  const selectMessages = await messages.getByFilterEQ("chatid",id);
  selectMessages.sort((a,b) => a.id - b.id);
  res.ok(selectMessages);
}



module.exports.addNewMessage = async (req, res, next) => {
  const { id, sender, chatid, datesent, content} = req.body
  // const allMessages = await messages.get();
  messages.add({id, sender, chatid, datesent, content});
  res.ok('New messages created')
}

