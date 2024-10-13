const landingPage = document.getElementById("landingPageDiv");
const callPage = document.getElementById("callPageDiv");
const submitNickName = document.getElementById("submitNicknameDiv");
const submitedNickName = document.getElementById("submittedUserNickNameDiv");
const nickNameForm = document.getElementById("nickNameForm");
const roomNameForm = document.getElementById("roomNameForm");
const roomListDiv = document.getElementById("roomListDiv");
const myVideo = document.getElementById("myCamera");
const peerVideo = document.getElementById("peerCamera");

let myNickname = "anonymous";
let roomName;

landingPage.hidden = false;
callPage.hidden = true;
submitNickName.hidden = false;
submitedNickName.hidden = true;

//socket io
const socket = io();

socket.on("connect", () => {
  console.log("connection sucess: ", socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnect!!!");
});

//callPage

async function getMyCamera() {
  try {
    const myMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideo.srcObject = myMediaStream;
  } catch (e) {
    console.log(e);
  }
}

//landing page
function handleNickname(event) {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  console.log(`submit Nick Name: ${input.value}`);
  myNickname = input.value;
  submitNickName.hidden = true;
  submitedNickName.hidden = false;
  const h3 = document.createElement("h3");
  h3.innerText = `User Nickname : ${myNickname}`;
  submitedNickName.appendChild(h3);
  input.value = "";
}
function handleRoomname(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  const roomList = roomListDiv.querySelector("h3");
  console.log(`submit Room Name: ${input.value}`);
  roomName = input.value;
  const li = document.createElement("li");
  li.innerText = roomName;
  roomList.appendChild(li);
  input.value = "";
  landingPage.hidden = true;
  callPage.hidden = false;
  initCallPage();
}
function initCallPage() {
  const roomNameh2 = document.createElement("h2");
  roomNameh2.innerText = `RoomName : ${roomName}`;
  callPage.prepend(roomNameh2);
  const nickNameh2 = document.createElement("h2");
  nickNameh2.innerText = `My NickName : ${myNickname}`;
  callPage.prepend(nickNameh2);
  getMyCamera();
}

nickNameForm.addEventListener("submit", handleNickname);
roomNameForm.addEventListener("submit", handleRoomname);
