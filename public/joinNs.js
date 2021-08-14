function joinNs(endpoint){
  const nsSocket = io(endpoint);
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

  nsSocket.on("messageToClients", msg => {
    document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`
  });

  document.querySelector(".message-form").addEventListener("submit", evt => {
    evt.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer', {text: newMessage})
  });
}