function joinRoom(roomName){
  // send this room name to the server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMemebers) => {
    // we want to update room number total once we have joined the room
    document.querySelector(".curr-room-num-users").innerHTML = `${newNumberOfMemebers} <span class="glyphicon glyphicon-user"></span>`
  });
}