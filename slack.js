const express = require("express");
const app = express();
const socketio = require("socket.io");
const namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

// express server listening to port 9000
const expressServer = app.listen(process.env.PORT || 9000);
// socket io listening to the express server
const io = socketio(expressServer);

// once the connection is established
io.on("connection", socket => {
  // build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  });

  // send the nsData back to the client. We need to use socket instead of io as we want it
  // just go to this client
  socket.emit("nsData", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on("connection", nsSocket => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

    // a socket has connected to one of our chatgroup namespaces
    // send that namespace group info back

    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    nsSocket.on("joinRoom", async (roomToJoin, numberOfUsersCallback) => {
      // deal with chat history once we have it
      nsSocket.join(roomToJoin);

      const clients = await io.of('/wiki').in(roomToJoin).allSockets();
      numberOfUsersCallback((Array.from(clients)).length);

      const nsRoom = namespaces[0].rooms.find(room => room.roomTitle === roomToJoin);

      nsSocket.emit("historyCatchUp", nsRoom.history);
    });
    nsSocket.on("newMessageToServer", msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "rbunch",
        avatar: "https://via.placeholder.com/30"
      }

      // The user will be in the second room in the object list as the sockets always join its own room in the first connection
      const roomTitle = [];
      for(let room of nsSocket.rooms){
          roomTitle.push(room)
      }
      
      // find the room object for this room
      const nsRoom = namespaces[0].rooms.find(room => room.roomTitle === roomTitle[1]);

      console.log(nsRoom);

      nsRoom.addMessage(fullMsg);
      io.of("/wiki").to(roomTitle[1]).emit("messageToClients", fullMsg);
    });
  });
});
