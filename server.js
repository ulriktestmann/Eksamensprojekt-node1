var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require("ip");

var port = process.env.PORT || 12000;
var userArray = [];

app.get('/', function(req, res){
//  userArray.push(req.ip);
	res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){

  userArray.push(ip.address());
  console.log("User connected from ip: " + ip.address());

  io.emit("userlist push", userArray);

  //send chat message
  socket.on('chat message', function(msg){
  	var clientIP = ip.address();
  	msg = clientIP +": "+ msg;
    io.emit('chat message', msg);
  });

  socket.on("disconnect", function(){
    
    var array = userArray;
      for (var i = array.length - 1; i >= 0; --i) {
        if (array[i] == ip.address()) {
         array.splice(i,1);
        }
      }
    userArray = array; 
    io.emit("userlist push", userArray);
    console.log("User disconnected from ip:  " + ip.address()); 
  }); 

});



http.listen(port, function(){
  console.log('listening on *:' + port);
});



