const socket = io(); // connect to main namespace

// client listens for message from the server 
socket.on("messageFromServer", (dataFromServer) => {
  // prints server's messge
  console.log(dataFromServer);
  // client emits message to the server
  socket.emit("messageToServer", {data: "This is from the client"});
});

socket.on("nsData", nsData => {
  console.log("The list of nsData has arrived");

  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class = "namespace"><img src = "${ns.img}"/></div>`
  })
})

socket.on("joined", msg => console.log(msg));

document.querySelector("#message-form").addEventListener("submit", evt => {
  evt.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', {text: newMessage})
});
