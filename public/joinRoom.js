function joinRoom(roomName){
  // send this room name to the server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMemebers) => {
    // we want to update room number total once we have joined the room
    document.querySelector(".curr-room-num-users").innerHTML = `${newNumberOfMemebers} <span class="glyphicon glyphicon-user"></span>`
  });

  nsSocket.on("historyCatchUp", history => {

    console.log(history);

    const messageUl = document.querySelector("#messages");
    messageUl.innerHTML = "";
    // build history from top down
    history.forEach(msg => {
      const newMsg = buildHTML(msg);
      const currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages + newMsg;
    });

    messageUl.scrollTo(0, messageUl.scrollHeight);
  });

  nsSocket.on("updateMembers", numMembers => {
    document.querySelector(".curr-room-num-users").innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });


  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", event => {
    let messages = Array.from(document.getElementsByClassName("message-text"));

    messages.forEach(msg => {
      if (msg.innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) === -1){
        // the message does not contain the search term
        msg.style.display = "none";
      } else{
        msg.style.display = "block";
      }
    });
  });
}