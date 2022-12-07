// // actual endpoint logic/implementation is defined here

// const { ErrNotFound, errExists, ErrRes } = require('../lib/responseHandler');
const DbCollection = require('../DBmock/dblocal');
const messages = new DbCollection('messages');


module.exports.allMessages = async (req, res, next) => {
  const allMessages = await messages.get();
  res.ok(allMessages);
};

module.exports.getMessagesById = async (req, res, next) => {
  console.log('params', req.params);
  const allMessages = await messages.get();
  // res.ok(users.getById(id));
  res.ok(messages.getById(req.params.id))
}
module.exports.addNewMessage = async (req, res, next) => {
  const { id, sender, chatid, datesent, content} = req.body
  // const allMessages = await messages.get();
  messages.add({id, sender, chatid, datesent, content});
  res.ok('New messages created')
}

