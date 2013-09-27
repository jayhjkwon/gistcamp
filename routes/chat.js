var 
    async     = require('async'),
    mongoose  = require('mongoose'),
    ChatContent = require('../models/chatContent')
;

exports.start = function(io){

  var removeBySocketId = function(target, val) {
    if (target == undefined)
      return false;

    for(var key in target) {
      if (target[key].id === val) {
        return key;
      }
    }

    return false;
  };

  var removeById = function(target, val) {
    if (target == undefined)
      return false;

    for(var i=0; i<target.length; i++) {
        if(target[i].id === val) {
            //target.splice(i, 1);
            target[i].opacity = 0.4;
            return true;
        }
    }

    return false;
  };

  var addById = function(target, val) {
    for(var i=0; i<target.length; i++) {
        if(target[i].id === val) {
            //target.splice(i, 1);
            target[i].opacity = 1.0;
            return true;
        }
    }

    return false;
  };

  var emptyRoomYn = function(target) {
    if (target == undefined)
      return false;
    
    var count = 0;
    for(var i=0; i<target.length; i++) {
        if(target[i].opacity == 0.4) {
            count += 1;
        }
    }

    return count == target.length ? true : false;
  };

  var insertChatContent = function(room, userid, login, avatar, data) {
      // insert to mongodb
      var chatContent = new ChatContent();
      chatContent.room_key = room;
      chatContent.user_id = userid;
      chatContent.user_login = login;
      chatContent.avatar_url = avatar;
      chatContent.content = data;
      chatContent.created_at = datetimeNow();

      chatContent.save(function(err) {
        if (err)
          console.log('chatContent save error : ' + err);
      });
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

  // delete room interval
  var interval = 1000 * 60 * 60 * 24;

  io.sockets.on('connection', function (socket) {

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(user){

      socket.userid = user.id;

      // add the client's username to the global list
      user.socketid = socket.id;
      usernames[socket.id] = user;
    });

    socket.on('getrooms', function() {

      for(var key in rooms) {
          if (rooms[key].lastLeaveDatetime != undefined) {
            if (rooms[key].lastLeaveDatetime + interval < new Date().getTime()) {
              delete rooms[key];
            }
          }
      }

      socket.emit('updaterooms', rooms);
    });
    
    socket.on('addroom', function(roomname){
      socket.room = roomname;

      if (rooms[roomname] == undefined) {
          rooms[roomname] = {};
          rooms[roomname].users = new Array();
      }

      var added = addById(rooms[roomname].users, socket.userid);
      if (added == false) {
        //usernames[socket.userid].opacity = 1;
        var userinfo = {};
        userinfo.id = usernames[socket.id].id;
        userinfo.login = usernames[socket.id].login;
        userinfo.socketid = usernames[socket.id].socketid;
        userinfo.avatar = usernames[socket.id].avatar;
        userinfo.url = usernames[socket.id].url;
        userinfo.opacity = 1;

        rooms[roomname].users.push(userinfo);  
      }

      rooms[roomname].lastLeaveDatetime = undefined;

      socket.join(roomname);

      var data = 'connected to ' + roomname + ' gist room';
      socket.emit('updatechat', 'SERVER', data);
      
      socket.broadcast.emit('updaterooms', rooms);
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.in(socket.room).emit('updatechat', usernames[socket.id], data);
      insertChatContent(socket.room, socket.userid, usernames[socket.id].login, usernames[socket.id].avatar, data);
    });

    socket.on('sendalarm', function (userid, data) {

      var receiverSocketId = removeBySocketId(usernames, userid)
      if (receiverSocketId != false) {
        io.sockets.socket(receiverSocketId).emit('updatealarm', usernames[socket.id], data);
      }
    });
    
    socket.on('switchRoom', function(newroom) {
      if (rooms[socket.room] != undefined) {  
        socket.leave(socket.room);
        removeById(rooms[socket.room].users, socket.userid);

        var data = usernames[socket.id].login + ' has left this room';
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', data);

        if (emptyRoomYn(rooms[socket.room].users) == true) {
          rooms[socket.room].lastLeaveDatetime = new Date().getTime();
        }
      }

      if (rooms[newroom] == undefined) {
          rooms[newroom] = {};
          rooms[newroom].users = new Array();
      }
      
      var added = addById(rooms[newroom].users, socket.userid);
      if (added == false) {
        //usernames[socket.userid].opacity = 1;
        var userinfo = {};
        userinfo.id = usernames[socket.id].id;
        userinfo.login = usernames[socket.id].login;
        userinfo.socketid = usernames[socket.id].socketid;
        userinfo.avatar = usernames[socket.id].avatar;
        userinfo.url = usernames[socket.id].url;
        userinfo.opacity = 1;

        rooms[newroom].users.push(userinfo);  
      }

      rooms[newroom].lastLeaveDatetime = undefined;
      socket.join(newroom);
      
      // update socket session room title
      socket.room = newroom;
      var data = usernames[socket.id].login + ' has joined this room';
      socket.broadcast.to(newroom).emit('updatechat', 'SERVER', data);

      socket.emit('updaterooms', rooms);
      socket.broadcast.emit('updaterooms', rooms);
      
    });

    socket.on('leaveRoom', function(leaveRoom) {
      if (rooms[leaveRoom] != undefined) {
        socket.leave(leaveRoom);
        removeById(rooms[leaveRoom].users, socket.userid);

        if (emptyRoomYn(rooms[leaveRoom].users) == true) {
          rooms[leaveRoom].lastLeaveDatetime = new Date().getTime();
        }

        if (usernames[socket.id] != undefined) {
          var data = usernames[socket.id].login + ' has left this room';
          socket.broadcast.to(leaveRoom).emit('updatechat', 'SERVER', data);
        }

        socket.broadcast.emit('updaterooms', rooms);
      }
    });
    
    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
      // remove the username from global usernames list
      delete usernames[socket.id];
      
      if (socket.room != undefined && rooms[socket.room] != undefined) {
        socket.leave(socket.room);
        removeById(rooms[socket.room].users, socket.userid);
        
        if (emptyRoomYn(rooms[socket.room].users) == true) {
          rooms[socket.room].lastLeaveDatetime = new Date().getTime();
        }

        socket.broadcast.emit('updaterooms', rooms);
      }
    });
    
  });
};




