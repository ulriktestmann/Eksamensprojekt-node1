var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 12000;
var userArray = [];

app.get('/', function(req, res){
  	userArray.push(req.ip);
  	console.log(userArray);

	res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	var clientIP = socket.request.connection.remoteAddress;
  	msg = clientIP +": "+ msg;
    io.emit('chat message', msg);
  });

  socket.on("userlist request", function(){
  	io.emit("userlist request", userArray);
  });

});



http.listen(port, function(){
  console.log('listening on *:' + port);
});



