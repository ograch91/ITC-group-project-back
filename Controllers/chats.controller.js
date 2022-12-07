const DbCollection = require('../DBmock/dblocal');
const chats = new DbCollection('chats');


module.exports.allChats = async (req, res, next) => {
    const allChats = await chats.get();
    res.ok(allChats)
}

module.exports.getChatsById = async (req, res, next) => {
    console.log('params', req.params);
    const allChats = await chats.get();
    res.ok(chats.getById(req.params.id))
}


module.exports.addNewChat = async (req, res, next) => {
    const { id, created, participants } = req.body
    // const allMessages = await messages.get();
    chats.add({ id, created, participants });
    res.ok('New chats created')
}
