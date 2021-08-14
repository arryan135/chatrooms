const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespace = require("./data/namespaces");
console.log(namespace[0]);

app.use(express.static(__dirname + "/public"));

// express server listening to port 9000
const expressServer = app.listen(process.env.PORT || 9000);
// socket io listening to the express server
const io = socketio(expressServer);

// once the connection is established
io.on("connection", socket => {
  // server emits message
  socket.emit("messageFromServer", {data: "Welcome to the socketio client"});
  // server listens to message from the client
  socket.on("messageToServer", dataFromClient => {
    // prints clients messages
    console.log(dataFromClient);
  });

  socket.join("level2");
  socket.to("level2").emit("joined", `${socket.id} says that it has joined the level 1 room`);
});

io.of("/admin").on("connection", socket => {
  console.log("Someone connected to the admin namespace");
  io.of("/admin").emit("welcome", "Welcome to the admin channel");
});