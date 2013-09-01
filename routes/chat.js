var 
    async     = require('async'),
    mongoose  = require('mongoose'),
    ChatContent = require('../models/chatContent')
;

exports.start = function(io){

  var removeById = function(target, val) {
    for(var i=0; i<target.length; i++) {
          if(target[i].id == val) {
              target.splice(i, 1);
              break;
          }
      }
  };

  var datetimeNow = function() {
    var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + "-" 
                    + (currentdate.getMonth()+1)  + "-"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    return datetime;
  };
  // usernames which are currently connected to the chat
  var usernames = {};

  // rooms which are currently available in chat
  var rooms = {};

  io.sockets.on('connection', function (socket) {

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(user){
      // store the username in the socket session for this client
      socket.userid = user.id;
      // store the room name in the socket session for this client
      //socket.room = 'room1';
      // add the client's username to the global list
      user.socketid = socket.id;
      usernames[user.id] = user;
      // send client to room 1
      // socket.join('room1');
      // echo to client they've connected
      // socket.emit('updatechat', 'SERVER', 'you have connected to room1');
      // echo to room 1 that a person has connected to their room
      // socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
      // socket.emit('updaterooms', rooms, 'room1');
      
    });

    socket.on('getrooms', function() {
      socket.emit('updaterooms', rooms);
    });
    
    socket.on('addroom', function(roomname){
      socket.room = roomname;

      if (rooms[roomname] == undefined) {
          rooms[roomname] = new Array();
      }

      rooms[roomname].push(usernames[socket.userid]);
      
      console.log('addroom length ' + rooms[roomname].length);

      socket.join(roomname);

      socket.emit('updatechat', 'SERVER', 'connected to ' + roomname + ' gist room');
      // socket.broadcast.to(roomname).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
      socket.broadcast.emit('updaterooms', rooms);
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.in(socket.room).emit('updatechat', usernames[socket.userid], data);

      // insert to mongodb
      chatContent = new ChatContent();
      chatContent.room_key = socket.room;
      chatContent.user_id = socket.userid;
      chatContent.user_login = usernames[socket.userid].login;
      chatContent.avatar_url = usernames[socket.userid].avatar;
      chatContent.content = data;
      chatContent.created_at = datetimeNow();

      chatContent.save(function(err) {
        if (err)
          console.log('chatContent save error : ' + err);
        else
          console.log('success');
      })

      //io.sockets.socket(socket.id).emit('updatealarm', usernames[socket.userid], data);
    });

    socket.on('sendalarm', function (userid, data) {
      var receiver = usernames[userid];
      if (receiver != undefined) {
        io.sockets.socket(receiver.socketid).emit('updatealarm', usernames[socket.userid], data);
      }
    });
    
    socket.on('switchRoom', function(newroom) {
      if (rooms[socket.room] != undefined) {  
        socket.leave(socket.room);
        removeById(rooms[socket.room], socket.userid);
        //rooms[socket.room].removeById(socket.userid); 

        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', usernames[socket.userid].login + ' has left this room');

        if (rooms[socket.room].length == 0) {
          delete rooms[socket.room];
          socket.broadcast.emit('deleteroom', socket.room)
        }
      }

      if (rooms[newroom] == undefined) {
          rooms[newroom] = new Array();
      }

      rooms[newroom].push(usernames[socket.userid]);
      
      socket.join(newroom);
      //socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
      // sent message to OLD room
      
      // update socket session room title
      socket.room = newroom;
      socket.broadcast.to(newroom).emit('updatechat', 'SERVER', usernames[socket.userid].login + ' has joined this room');
      socket.emit('updaterooms', rooms);
      socket.broadcast.emit('updaterooms', rooms);
      
    });

    socket.on('leaveRoom', function(leaveRoom) {
      if (rooms[leaveRoom] != undefined) {
        socket.leave(leaveRoom);
        removeById(rooms[leaveRoom], socket.userid);
        //rooms[leaveRoom].removeById(socket.userid);

        if (rooms[leaveRoom].length == 0) {
          delete rooms[leaveRoom];
          socket.broadcast.emit('deleteroom', leaveRoom);
        } 

        if (usernames[socket.userid] != undefined) {
          socket.broadcast.to(leaveRoom).emit('updatechat', 'SERVER', usernames[socket.userid].login + ' has left this room');  
        }

        socket.broadcast.emit('updaterooms', rooms);
      }
    });
    
    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
      // remove the username from global usernames list
      var userid = socket.userid;
      delete usernames[socket.userid];
      // update list of users in chat, client-side
      // io.sockets.emit('updateusers', usernames[socket.userid]);
      // echo globally that this client has left
      // socket.broadcast.emit('updatechat', 'SERVER', userid + ' has disconnected');
      
      if (socket.room != undefined && rooms[socket.room] != undefined) {
        socket.leave(socket.room);
        removeById(rooms[socket.room], socket.userid);
        //rooms[socket.room].removeById(socket.userid); 
        if (rooms[socket.room].length == 0) {       
          delete rooms[socket.room];
          socket.broadcast.emit('deleteroom', socket.room);
        }

        socket.broadcast.emit('updaterooms', rooms);
      }
    });
    
  });
};




