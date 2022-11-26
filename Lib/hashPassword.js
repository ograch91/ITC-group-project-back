const bcrypt = require('bcryptjs');

module.exports.hashPassword = async plainText => {
  // salt is a random string of characters that is added to the password before hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainText, salt);
  return hash;
};

module.exports.verifyPassword = async (plainText, hash) => {
  return await bcrypt.compare(plainText, hash);
};

// for test 