var 
    async     = require('async'),
    mongoose  = require('mongoose'),
    ChatContent = require('../models/chatContent'),
    ChatRoom = require('../models/chatRoom')
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

  var socketIdByLogin = function(target, val) {
    if (target == undefined)
      return false;

    for(var key in target) {
      if (target[key].login === val) {
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

  var insertChatRoom = function(room, roomname) { //name, lastLeaveDatetime, users) {

      room.roomname = roomname;
      if (room.lastLeaveDatetime == undefined)
        room.lastLeaveDatetime = '0';

      ChatRoom.findOneAndUpdate({roomname: roomname}, room, {upsert:true}, function(err, userInfo){
        if (err)
          console.log('chatRoom save error : ' + err);
      });
  };

  var deleteCharRoom = function(roomname) {

    console.log('deleteCharRoom : ' + roomname)

    ChatRoom.remove({roomname:roomname}, function (err) {
      if (err) {
        console.log('deleteCharRoom error : ' + err);
      };
    });

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

  var initializeChatRoom = function() {
    ChatRoom
      .find()
      .select()
      .lean()
      .exec(function(err, docs){
        if (docs) {
          console.dir(docs);
          
          for(var i=0; i<docs.length; i++) {
            var roomname = docs[i].roomname;
            rooms[roomname] = {};
            rooms[roomname].lastLeaveDatetime = docs[i].lastLeaveDatetime;
            rooms[roomname].users = docs[i].users;

            for(var j=0; j<rooms[roomname].users.length; j++) {
              rooms[roomname].users[j].opacity = 0.4;
              //rooms[roomname].users[j].socketid = rooms[roomname].users[j].id;
            }
          }
        }
      });
  };

  // usernames which are currently connected to the chat
  var usernames = {};

  // rooms which are currently available in chat
  var rooms = {};

  // delete room interval
  var interval = 1000 * 60 * 60 * 24 * 7;

  initializeChatRoom();

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
              deleteCharRoom(key);
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

        var userinfo = {};
        userinfo.id = usernames[socket.id].id;
        userinfo.login = usernames[socket.id].login;
        userinfo.socketid = usernames[socket.id].socketid;
        userinfo.avatar = usernames[socket.id].avatar;
        userinfo.url = usernames[socket.id].url;
        userinfo.opacity = 1;

        rooms[roomname].users.push(userinfo);  
      }

      insertChatRoom(rooms[roomname], roomname);
      rooms[roomname].lastLeaveDatetime = undefined;

      socket.join(roomname);

      var data = 'connected to ' + roomname + ' gist room';
      socket.emit('updatechat', 'SERVER', data);
      
      socket.broadcast.emit('updaterooms', rooms);
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.in(socket.room).emit('updatechat', usernames[socket.id], data, datetimeNow());
      insertChatContent(socket.room, socket.userid, usernames[socket.id].login, usernames[socket.id].avatar, data);
    });

    socket.on('sendalarm', function (userid, data) {

      var receiverSocketId = removeBySocketId(usernames, userid)
      if (receiverSocketId != false) {
        io.sockets.socket(receiverSocketId).emit('updatealarm', usernames[socket.id], data);
      }
    });

    socket.on('sendalarmByLogin', function (login, data) {

      var receiverSocketId = socketIdByLogin(usernames, login)
      if (receiverSocketId != false) {
        io.sockets.socket(receiverSocketId).emit('updatealarm', usernames[socket.id], data);
      }
    });
    
    socket.on('switchRoom', function(newroom) {
      if (rooms[socket.room] != undefined) {  
        socket.leave(socket.room);
        removeById(rooms[socket.room].users, socket.userid);

        var data = usernames[socket.id].login + ' has left this room';
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', data, datetimeNow());

        if (emptyRoomYn(rooms[socket.room].users) == true) {
          rooms[socket.room].lastLeaveDatetime = new Date().getTime();
        }

        insertChatRoom(rooms[socket.room], socket.room);
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

        //insertChatRoom(newroom, rooms[newroom].lastLeaveDatetime, rooms[newroom].users);  
      }

      rooms[newroom].lastLeaveDatetime = undefined;
      socket.join(newroom);
      
      insertChatRoom(rooms[newroom], newroom);

      // update socket session room title
      socket.room = newroom;
      var data = usernames[socket.id].login + ' has joined this room';
      socket.broadcast.to(newroom).emit('updatechat', 'SERVER', data, datetimeNow());

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

        insertChatRoom(rooms[leaveRoom], leaveRoom);  

        if (usernames[socket.id] != undefined) {
          var data = usernames[socket.id].login + ' has left this room';
          socket.broadcast.to(leaveRoom).emit('updatechat', 'SERVER', data, datetimeNow());
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

        insertChatRoom(rooms[socket.room], socket.room);

        socket.broadcast.emit('updaterooms', rooms);
      }
    });
    
  });
};




