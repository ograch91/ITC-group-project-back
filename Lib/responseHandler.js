class ResponseHandler {
  constructor(status, success, resp) {
    this.status = status;
    this.success = success;
    this.resp = resp;
    return this.toBlock();
  }
  toBlock() {
    return {
      status: this.status,
      payload: {
        success: this.success,
        [this.success ? 'data' : 'error']: this.resp
      }
    };
  }
}

module.exports.ValidRes = (data) => new ResponseHandler(200, true, data);
module.exports.ErrRes = (errors) => new ResponseHandler(400, false, errors);
module.exports.internalErr = (errors) => new ResponseHandler(500, false, errors || 'Internal Server Error');
module.exports.ErrNotFound = (msg) => new ResponseHandler(404, false, msg || 'Not Found');
module.exports.errExists = (msg) => new ResponseHandler(409, false, msg || 'Already exists');
module.exports.errNoAuth = (msg) => new ResponseHandler(401, false, msg || 'User Must be logged in');
module.exports.errNotAllowed = (msg) => new ResponseHandler(403, false, msg || 'Forbidden');
