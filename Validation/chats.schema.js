const yup = require('yup');

let startChatSchema = yup.object().shape({
  created: yup.number().required(),
  participants: yup.array().of(yup.string().required()).min(2).required(),
});

module.exports = {
  startChatSchema,
};
