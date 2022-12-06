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


