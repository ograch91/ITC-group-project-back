// // actual endpoint logic/implementation is defined here

// const { ErrNotFound, errExists, ErrRes } = require('../lib/responseHandler');
const DbCollection = require('../DB/mongodb');
const messages = new DbCollection('messages');


module.exports.allMessages = async (req, res, next) => {
  const allMessages = await messages.get();
  res.ok(allMessages);
};

module.exports.getMessagesById = async (req, res, next) => {
  // res.ok(users.getById(id));
  const selectedMessage = await messages.getById(req.params.id);
  res.ok(selectedMessage);
}
module.exports.addNewMessage = async (req, res, next) => {
  const { sender, chatid, datesent, content} = req.body
  // const allMessages = await messages.get();
  messages.add({ sender, chatid, datesent, content});
  res.ok('New messages created')
}

