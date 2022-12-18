// each endpoint validation-schema is defined here

const yup = require('yup');

const regexs = {
    validPass: /^[aA-zZ0-9\s]+$/,
  };
  

let messagesSchema = yup.object().shape({
    sender: yup.string().required(),
    chatid: yup.string().required(),
    datesent: yup.number().required(),
    // content: yup.string().required().matches(regexs.validPass)
    content: yup.string().required()
})



module.exports = {
    messagesSchema
};
