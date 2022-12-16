// const DbCollection = require('../DBmock/dblocal');
const DbCollection = require('../DB/mongodb');
const chats = new DbCollection('chats');


module.exports.allChats = async (req, res, next) => {
    const allChats = await chats.get();
    res.ok(allChats);
}

module.exports.getChatsById = async (req, res, next) => {
    // console.log('params', req.params);
    // const allChats = await chats.get();
    const currentChat= await chats.getById(req.params.id);
    res.ok(currentChat);
}


module.exports.addNewChat = async (req, res, next) => {
    const { created, participants } = req.body
    // const allMessages = await messages.get();
    chats.add({created, participants });
    res.ok('New chats created')
}
