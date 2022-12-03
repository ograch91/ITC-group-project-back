// const DbCollection = require('../db/mongodb');
const DbCollection = require('../DBmock/dblocal');
const { hashPassword } = require('../lib/hashpassword');
const users = new DbCollection('users');

// module.exports.getUserByEmail = async email => {
//   const arr = await users.getByFilterEQ('email', email);
//   return arr[0];
// };
module.exports.getUserByEmail = (email) => {
  
  const list = users.get();
  console.log(list);
  const user = list.find(i => i.email === email);
  return user;
}

// remove security data from user object
// module.exports.userForFront = user => {
//   delete user.password;
//   delete user.passDebug;
//   delete user.hash;
//   delete user._id;
//   return user;
// };

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
