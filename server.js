var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require("ip");

var port = process.env.PORT || 12000;
var userArray = [];

app.get('/', function(req, res){
  //push user to array on page request
  userArray.push(req.ip);
	res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
  
  //connection ip variable
  var userIP = socket.handshake.address;
  console.log("Socket connection established: " + userIP);

  //push userlist to clients
  io.emit("userlist push", userArray);

  //send chat message
  socket.on('chat message', function(msg){
  	var clientIP = userIP;
  	msg = clientIP +": "+ msg;
    io.emit('chat message', msg);
  });

  socket.on("disconnect", function(){
    
    var array = userArray;
      for (var i = array.length - 1; i >= 0; --i) {
        if (array[i] == userIP) {
         array.splice(i,1);
        }
      }
      
    userArray = array; 
    io.emit("userlist push", userArray);
    console.log("User disconnected from ip:  " + userIP); 

    //push userlist on client request
    socket.on("userlist request", function(){
      io.emit("userlist push", userArray);
      console.log("client request approved");
    });

  }); 

});



http.listen(port, function(){
  console.log('listening on *:' + port);
});



