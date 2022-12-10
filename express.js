const express = require('express');
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser')

const { ValidRes, internalErr } = require('./lib/responseHandler');

const app = express();

app.use(express.json());
app.use(bodyParser.json())

app.use(
  cors({
    origin: 'http://localhost:3000',
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

app.use('/users', require('./routes/users.route'));
app.use('/messages', require('./routes/messages.route'));
app.use('/chats', require('./routes/chats.route'));



app.use((err, req, res, next) => {
  console.log('err ->>> ', err);
  res.respond(err);
});

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Express is listening on port ' + port);
});
