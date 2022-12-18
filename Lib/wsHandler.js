const { getUserByEmail } = require("../services/users.service");
const { verifyToken } = require("./JWT");

const connections = require('./activeConnections').getList();

module.exports.wsHandler = async (ws, req) => {

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
    // removeSession(wsSession, connections.remove);
    connections.delete(wsSession);
  });
}

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