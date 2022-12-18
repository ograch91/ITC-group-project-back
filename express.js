const express = require('express');

require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const { ValidRes, internalErr } = require('./lib/responseHandler');
const { verifyToken } = require('./lib/JWT');
const { getUserByEmail } = require('./services/users.service');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

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
// const wsServer = require('./lib/websock');

app.use('/users', require('./routes/users.route'));
app.use('/messages', require('./routes/messages.route'));
app.use('/chats', require('./routes/chats.route'));

app.use((err, req, res, next) => {
  console.log('err ->>> ', err);
  res.respond(err);
});

// const WebSocket = require('ws');
// const app = require('../express');

const wsServer = require('express-ws')(app);
// const { getUserByEmail } = require('../services/users.service');
// const { verifyToken } = require('./JWT');
// const server = new WebSocket.Server({
//         port: 8080
//     },
//     () => {
//         console.log('WS Server listening on port 8080');
//     }
// );

const users = require('./lib/websock');

app.ws('/', async (ws, req) => {
  const cookie = parseCookies(req.headers?.cookie);
  const token = req.headers?.token || cookie?.token;
  const decodeResult = verifyToken(token);
  if (!decodeResult.isValid) {
    ws.close();
    console.log('WS rejected');
    return;
  }
  const { email } = decodeResult.decoded;
  const user = await getUserByEmail(email);

  if (!user) {
    ws.close();
    console.log('WS user not found, rejected', email);
    return;
  }

  console.log('WS Connection accepted', email);

  const userRef = {
    ws,
    user,
  };
  console.log(users, 'users');
  users.cons.push(userRef);
  console.log(users.cons, 'users');
  ws.on('message', rawmessage => {
    console.log('WS Message: ', rawmessage);
    json = JSON.parse(rawmessage);
    // ws.send( "recieved"+email);
    [...users.cons]
      .filter(u => u.user.email == user.email)
      .forEach(u => u.ws.send('recieved' + u.user.email));
    console.log(json);
    // try {

    //     // Parsing the message
    //     const data = JSON.parse(message);

    //     // Checking if the message is a valid one

    //     if (
    //         typeof data.sender !== 'string' ||
    //         typeof data.body !== 'string'
    //     ) {
    //         console.error('Invalid message');
    //         return;
    //     }

    //     // Sending the message

    //     const messageToSend = {
    //         sender: data.sender,
    //         body: data.body,
    //         sentAt: Date.now()
    //     }

    //     sendMessage(messageToSend);

    // } catch (e) {
    //     console.error('Error passing message!', e)
    // }
  });

  ws.on('close', (code, reason) => {
    console.log(`WS Connection closed: ${code} ${reason}!`);
    // users.delete(userRef);
  });
});

// wsServer.on('error', (err) => {
//   console.log('WS Error: ', err);
// })

const parseCookies = cookie => {
  try {
    return cookie
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
  } catch (e) {
    return {};
  }
};

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Express is listening on port ' + port);
});

// const ws = ExpressWs(app);
