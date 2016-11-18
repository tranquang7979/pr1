var io = require('socket.io');

exports.initialize = function (server) {
    var games = [];
    var gameConnections = [];

    io = io.listen(server);

    // check cookie before allow to access application
    io.set('authorization', function (data, accept) {
        if (data.headers.cookie) {
            data.cookie = require('cookie').parse(data.headers.cookie);
            data.sessionID = data.cookie['connect.sid'].split('.')[0];
            console.log("====== NICKNAME: " + data.cookie['nickname']);
            data.nickname = data.cookie['nickname'];
        } else {
            return accept('No cookie transmitted.', false);
        }
        accept(null, true);
    });

    var self = this;

    //đọc file lấy danh sách games
    // games = readfile(...);
    /*BAC1, BAC2, XD1, XD2*/
    for (var i = 0; i < games.length; i++) {
        this.gameConnections[games[i]] = io.of("/" + games[i]);
        //this.gameConnections["BAC1"] = io.of("/BAC1");
    }


    this.lobby = io.of("/lobby");
    this.lobby.on("connection", function (socket) {
        socket.on("join_lobby", function (room) {
            //
            socket.broadcast.emit('setLobby', { 'countdown': nickname });
        });
    });


    this.chatInfra = io.of("/chat_infra");
    this.chatInfra.on("connection", function (socket) {

        //lấy ra giá trị truyền vào
        console.log("--- HANDSHAKE: --- " + socket.handshake.query.username);
        console.log("--- HANDSHAKE: --- " + socket.handshake.query.password);
        if (socket.handshake.query.username === "PETER") {
            //gọi broadcast xuống đúng client đó, ví dụ gọi broadcast đến hàm 'loginSuccess' được định nghĩa ở client
            //socket.broadcast.emit('loginSuccess', data);
        }

        socket.send(JSON.stringify({
            type: 'serverMessage',
            message: 'Welcome to the most interesting chat room on earth!'
        }));

        // socket.on("set_name", function(data){
        //   socket.set('nickname', data.name, function(){
        //     socket.emit('name_set', data);
        //     socket.send(JSON.stringify({
        //       type:'serverMessage',
        //       message: 'Welcome to the most interesting chat room on earth!'
        //     }));
        //     //socket.broadcast.emit('user_entered', data);
        //   });
        // });

        socket.on("join_room", function (room) {
            var nickname = socket.handshake.nickname;
            socket.set('nickname', nickname, function () {
                socket.emit('name_set', { 'name': socket.handshake.nickname });
                socket.send(JSON.stringify({
                    type: 'serverMessage',
                    message: 'Welcome to the most interesting chat room on earth!'
                }));
                socket.join(room.name);
                var comSocket = self.chatCom.sockets[socket.id];
                comSocket.join(room.name);
                comSocket.room = room.name;
                socket.in(room.name).broadcast.emit('user_entered', { 'name': nickname });
            });
        });

        socket.on("get_rooms", function () {
            var rooms = {};
            for (var room in io.sockets.manager.rooms) {
                if (room.indexOf("/chat_infra/") == 0) {
                    var roomName = room.replace("/chat_infra/", "");
                    rooms[roomName] = io.sockets.manager.rooms[room].length;
                }
            }
            socket.emit("rooms_list", rooms);
        });

        socket.on("check_connect", function () {
            socket.emit("connect_status", "true");
        });
    });

    this.chatCom = io.of("/chat_com");
    this.chatCom.on("connection", function (socket) {
        socket.on('message', function (message) {
            message = JSON.parse(message);
            if (message.type == "userMessage") {
                socket.get('nickname', function (err, nickname) {
                    message.username = nickname;

                    //room
                    socket.in(socket.room).broadcast.send(JSON.stringify(message));

                    //socket.broadcast.send(JSON.stringify(message));
                    message.type = "myMessage";
                    socket.send(JSON.stringify(message));
                });
            }
        });
    });
};
