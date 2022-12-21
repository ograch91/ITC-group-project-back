console.log('RUN TIME PATH',__dirname);
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const wsServer = require('express-ws')(app);
const { ValidRes, internalErr } = require('./Lib/responseHandler');
const { wsHandler } = require('./Lib/wsHandler');
const connections = require('./Lib/activeConnections').getList();

// LEAVE THIS HERE !!!!
// global.activesessions = new Set();
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: '*',
  })
);

app.use((req, res, next) => {
  res.ok = data => {
    res.respond(ValidRes(data));
  };

  res.respond = resp => {
    res.status(resp.status).json(resp.payload);
  };
  next();
});

// generic error handler for all routes
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    next(internalErr());
  }
});

app.ws('/', wsHandler);
app.use('/users', require('./Routes/users.route'));
app.use('/messages', require('./Routes/messages.route'));
app.use('/chats', require('./Routes/chats.route'));

app.use((err, req, res, next) => {
  console.log('err ->>> ', err);
  res.respond(err);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Express is listening on port ' + port);
});
