const { getUserByEmail } = require('../services/users.service');
const { verifyToken } = require('./JWT');

const connections = require('./activeConnections').getList();

module.exports.wsHandler = async (ws, req) => {
  const cookie = parseCookies(req.headers?.cookie);
  const token =
    req.headers?.token ||
    cookie?.token ||
    req.headers['sec-websocket-protocol'];
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

  const wsSession = {
    ws,
    user,
  };

  connections.add(wsSession);
  ws.on('message', rawmessage => {
    console.log('WS Message: ', rawmessage);
    json = JSON.parse(rawmessage);
    // ws.send( "recieved"+email);
    [...connections]
      .filter(u => u.user.email == user.email)
      .forEach(u => u.ws.send('recieved' + u.user.email));
  });

  ws.on('close', (code, reason) => {
    console.log(`WS Connection closed: ${code} ${reason}!`);
    // removeSession(wsSession, connections.remove);
    connections.delete(wsSession);
  });
};

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
