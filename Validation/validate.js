const { ErrRes } = require('../Lib/responseHandler');

module.exports.validateSchema = schema => {
  return (req, res, next) => {
    schema
      .validate(req.body, { abortEarly: false })
      .then(() => {
        next();
      })
      .catch(function (err) {
        next(ErrRes(err.errors));
      });
  };
};
