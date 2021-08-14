function joinNs(endpoint){
  if (nsSocket){
    // check to see if nsScoket exists
    nsSocket.close();
    // remove the event listener before it is added again
    document.querySelector("#user-input").removeEventListener("submit", formSubmission);
  }
  nsSocket = io(endpoint);
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
        // console.log(`Some one clicked on ${event.target.innerText}`);
        joinRoom(event.target.innerText);
      });
    });

    // add user to room automatically
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", msg => {
    const newMsg = buildHTML(msg);
    document.querySelector("#messages").innerHTML += newMsg;
  });

  document.querySelector(".message-form").addEventListener("submit", formSubmission);
}

function formSubmission(evt){
  evt.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  nsSocket.emit('newMessageToServer', {text: newMessage});
}

function buildHTML(msg){

  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li>
    <div class="user-image">
        <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
        <div class="user-name-time">${msg.username}<span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
  </li>
  `;

  return newHTML;
}