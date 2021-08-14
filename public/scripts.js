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
    namespacesDiv.innerHTML += `<div class = "namespace" ns=${ns.endpoint}><img src = "${ns.img}"/></div>`
  });

  // add a click listener for each namespace
  const arrayRep = Array.from(document.getElementsByClassName("namespace"));

  arrayRep.forEach(element => {
    element.addEventListener("click", event => {
      const endPoint = element.getAttribute("ns");
      console.log(`${endPoint} I should go to now`);
    });
  });

  const nsSocket = io("http://localhost:9000/wiki");
  nsSocket.on("nsRoomLoad", nsRooms => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach(room => {
      let glyph = room.privateRoom === "lock" ? "lock" : "globe";

      roomList.innerHTML += `<li class = "room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
    });

    // add click listener to each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach(element => {
      element.addEventListener("click", event => {
        console.log(`Some one clicked on ${event.target.innerText}`);
      });
    });
  });
})

socket.on("joined", msg => console.log(msg));

document.querySelector("#message-form").addEventListener("submit", evt => {
  evt.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', {text: newMessage})
});
