var socket = io.connect('/?username=PETER&password=123456');

var gameConnections = [];
var games = [];
//gọi lên NodeJS service để lấy danh sách games
for (var i = 0; i < games.length; i++) {
    gameConnections[games[i]] = io.connect("/" + games[i]);
    //this.gameConnections["BAC1"] = io.connect("/BAC1");
}

var lobby = io.connect("/lobby");
lobby.on('setLobby', function (data, callback) {
    
});


var chatBAC1 = io.connect('/BAC1');


//truyền tham số lên server
var chatInfra = io.connect('/chat_infra');
var chatCom = io.connect('/chat_com');

 var roomName = decodeURI((RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);

//The message event is emitted when a message sent by using socket.send is
//received. The message parameter is the sent message, and callback is an
//optional acknowledgment function.
chatInfra.on('message', function (data, callback) {
   data = JSON.parse(data);
   $('#messages').append('<div class="'+data.type+'">' + data.message + '</div>');
});

chatCom.on('message', function (data, callback) {
   data = JSON.parse(data);
   if(data.username){
     $('#messages').append('<div class="'+
                                      data.type+'"><span class="name">' +
                                      data.username + ":</span> " +
                                      data.message + '</div>');
   }
});

if (roomName) {
  chatInfra.emit('join_room', {'name':roomName});
  chatInfra.on('name_set', function (data, callback) {
    //chatInfra.emit('join_room', {'name':roomName});

    $('#nameform').hide();
    $('#messages').append('<div class="systemMessage">' + 'Hello '+data.name+'</div>');

    chatInfra.on("user_entered", function(user){
      $('#messages').append('<div class="systemMessage">' + user.name + ' has joined the room.' + '</div>');
    });
  });
}

$(document).ready(function(){
  $('#send').click(function(){
    var data = {
      message: $('#message').val(),
      type:'userMessage'
    };
    chatCom.send(JSON.stringify(data));
    $('#message').val('');
  });

  $('#setname').click(function () {
      var gameName = "BAC1";//lấy sau khi user click on Table
      for (var i = 0; i < games.length; i++) {
          if (games[i] === gameName) {
              gameConnections[games[i]].emit("set_name", { name: $('#nickname').val() });
          }
      }
    chatInfra.emit("set_name", {name: $('#nickname').val()});
  });



  $("#message").keydown(function (event) {
      if (event.which || event.keyCode) {
          if ((event.which == 13) || (event.keyCode == 13)) {
              $('#send').click();
          }
      }
  });

  $("#nickname").keydown(function (event) {
      if (event.which || event.keyCode) {
          if ((event.which == 13) || (event.keyCode == 13)) {
              $('#setname').click();
          }
      }
  });
});




//The connect event is emitted when the socket is connected successfully.
socket.on('connect', function () {});
//The connecting event is emitted when the socket is attempting to connect with the server.
socket.on('connecting', function () {});
// The disconnect event is emitted when the socket is disconnected.
socket.on('disconnect', function () {});
//The connect_failed event is emitted when socket.io fails to establish
//a connection to the server and has no more transports to fall back to.
socket.on('connect_failed', function () {});
//The error event is emitted when
//an error occurs and it cannot be handled by the other event types.
socket.on('error', function () {});
//The reconnect_failed event is emitted when socket.io fails to reestablish a working
//connection after the connection was dropped.
socket.on('anything', function (data, callback) {});
//The reconnect event is emitted when
//socket.io is successfully reconnected to the server.
socket.on('reconnect', function () {});
//The reconnecting event is emitted when
//the socket is attempting to reconnect with the server.
socket.on('reconnecting', function () {});
