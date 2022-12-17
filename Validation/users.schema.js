// each endpoint validation-schema is defined here

const yup = require('yup');

const regexs = {
  validPass: /^[aA-zZ0-9\s]+$/,
  validName: /^[aA-zZ0-9\s]+$/,
  validPhone: /^\+?[0-9]+$/,
};

let userLoginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().matches(regexs.validPass),
});

let userDetailSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().matches(regexs.validPass),
  name: yup.string().required().matches(regexs.validName),
  phone: yup.string().required().matches(regexs.validPhone),
});

let userImageUpdate = yup.object().shape({
  // id: yup.string().required(),
  photo: yup.string().url().required(),
});


module.exports = {
  userLoginSchema,
  userDetailSchema,
  userImageUpdate,
  
};
