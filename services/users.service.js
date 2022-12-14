const DbCollection = require('../DB/mongodb');
const { hashPassword } = require('../Lib/hashPassword');
const users = new DbCollection('users');

module.exports.getUserByEmail = async email => {
  const list = await users.get();
  const user = list.find(i => i.email === email);
  return user;
};

// remove security data from user object
module.exports.userForFront = user => {
  if (user.password) delete user.password;
  if (user.passDebug) delete user.passDebug;
  if (user.hash) delete user.hash;
  if (user._id) delete user._id;
  return user;
};

module.exports.getUserById = async id => {
  const user = await users.getById(id);
  return user;
};

// upgrade user to new security model
// module.exports.upgradeUser = async user => {
//   if (user.hash) {
//     return;
//   }
//   user.hash = await hashPassword(user.password);
//   user.passDebug = user.password;
//   delete user.password;
//   await users.updateItem(user.id, user);
//   console.log('user upgraded to hash', user.email);
// };
