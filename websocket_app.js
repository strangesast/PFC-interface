var WebSocketServer = require('ws').Server;

module.exports = function(server) {
  var wss = new WebSocketServer({
    server: server,
    path: '/sockets'
  });

  wss.on('connection', connectionListener);
};

var connectionListener = function(ws) {
  console.log('new socket connection');

  ws.on('message', function(message) {
    console.log(message);
  });

  ws.on('close', function() {
    console.log('socket closed');
  });
};
