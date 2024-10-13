const landingPage = document.getElementById("landingPageDiv");
const callPage = document.getElementById("callPageDiv");
const submitNickName = document.getElementById("submitNicknameDiv");
const submitedNickName = document.getElementById("submittedUserNickNameDiv");
const nickNameForm = document.getElementById("nickNameForm");
const roomNameForm = document.getElementById("roomNameForm");
const roomListDiv = document.getElementById("roomListDiv");
const myVideo = document.getElementById("myCamera");
const peerVideo = document.getElementById("peerCamera");
const myVideoOffBt = document.getElementById("myVideoOff");
const myAudioMuteBt = document.getElementById("myAudioMute");

let myNickname = "anonymous";
let roomName;
let myMediaStream;
let myCamera = true;
let myAudio = true;

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
    myMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideo.srcObject = myMediaStream;
  } catch (e) {
    console.log(e);
  }
}

function handleMyCameraBt(event) {
  event.preventDefault();
  if (myCamera) {
    myMediaStream.getVideoTracks()[0].stop();
    myCamera = false;
    myVideoOffBt.innerText = "Turn on Camera";
  } else {
    console.log(myMediaStream.getVideoTracks());
    getMyCamera();
    myCamera = true;
    myVideoOffBt.innerText = "Turn off Camera";
  }
}

function handleMyAudioBt(event) {
  event.preventDefault();
  if (myAudio) {
    myMediaStream.getAudioTracks()[0].stop();
    myAudio = false;
    myAudioMuteBt.innerText = "unMute";
  } else {
    getMyCamera();
    myAudio = true;
    myAudioMuteBt.innerText = "Mute";
  }
}

myVideoOffBt.addEventListener("click", handleMyCameraBt);
myAudioMuteBt.addEventListener("click", handleMyAudioBt);

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
