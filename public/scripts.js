const socket = io("http://localhost:9000"); // connect to main namespace
const socket2 = io("http://localhost:9000/admin"); // the admin namespace

// client listens for message from the server 
socket.on("messageFromServer", (dataFromServer) => {
  // prints server's messge
  console.log(dataFromServer);
  // client emits message to the server
  socket.emit("messageToServer", {data: "This is from the client"});
});

socket.on("joined", msg => console.log(msg));

socket2.on("welcome", dataFromServer => {
  console.log(dataFromServer);
});

document.querySelector("#message-form").addEventListener("submit", evt => {
  evt.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', {text: newMessage})
});
