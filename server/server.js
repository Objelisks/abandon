var io = require('socket.io')(80);

var connections = {};

var handleMessage = function(socket, msg) {
  socket.send('hi');
  Object.keys(connections).forEach(function(key) {
    if(key !== socket.id) {
      connections[key].send(msg);
    }
  })
}

io.on('connection', function(socket) {
  connections[socket.id] = socket;
  socket.on('message', function(msg) {
    handleMessage(socket, msg);
  });
  socket.on('disconnect', function() {
    delete connections[socket.id];
  });
});
