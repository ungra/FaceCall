const socket = io();

const landingPage = document.getElementById("landingpage");
const callPage = document.getElementById("callpage");

landingPage.hidden = false;
callPage.hidden = true;

socket.on("connect", () => {
  console.log("connection sucess: ", socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnect!!!");
});
