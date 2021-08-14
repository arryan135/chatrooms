const username = prompt("What is your username?");
const socket = io("/" , {
  query: {
    username
  }
}); // connect to main namespace
let nsSocket = "";

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
      joinNs(endPoint);
    });
  });
  joinNs("/wiki")
});
