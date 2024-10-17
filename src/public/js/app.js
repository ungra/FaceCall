const landingPageDiv = document.getElementById("landingPage");
const callPageDiv = document.getElementById("callPage");
const beforeNNDiv = document.getElementById("beforeNickname");
const afterNNDiv = document.getElementById("afterNickname");
const nicknameForm = document.getElementById("nickname");
const roomNameForm = document.getElementById("roomName");
const roomListh3 = document.getElementById("roomList");
const myCameraVideo = document.getElementById("myCamera");
const peerCmeraVideo = document.getElementById("peerCamera");
const myCameraOffBtn = document.getElementById("myCameraOff");
const myAudioMuteBtn = document.getElementById("myAudioMute");
const myCameraSelect = document.getElementById("myCameraList");
const myAudioSelect = document.getElementById("myAudioList");

let myNickname = "anonymous";
let roomName;
let myMediaStream;
let myDevices;
let myCameraList;
let myAudioList;

landingPageDiv.hidden = false;
callPageDiv.hidden = true;
beforeNNDiv.hidden = false;
afterNNDiv.hidden = true;

//socket io
const socket = io();

socket.on("connect", () => {
  console.log("connection sucess: ", socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnect!!!");
});

//landing page
function handleNickname(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  console.log(`submit Nick Name: ${input.value}`);
  myNickname = input.value;
  beforeNNDiv.hidden = true;
  afterNNDiv.hidden = false;
  const h3 = document.createElement("h3");
  h3.innerText = `User Nickname : ${myNickname}`;
  afterNNDiv.appendChild(h3);
  input.value = "";
}
function handleRoomName(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  console.log(`submit Room Name: ${input.value}`);
  roomName = input.value;
  const li = document.createElement("li");
  li.innerText = roomName;
  roomListh3.appendChild(li);
  input.value = "";
  landingPageDiv.hidden = true;
  callPageDiv.hidden = false;
  initCallPage();
}
function initCallPage() {
  const roomNameh2 = document.createElement("h2");
  roomNameh2.innerText = `RoomName : ${roomName}`;
  callPage.prepend(roomNameh2);
  nicknameh2 = document.createElement("h2");
  nicknameh2.innerText = `My NickName : ${myNickname}`;
  callPage.prepend(nicknameh2);
  settingMyMediaStream();
}

nicknameForm.addEventListener("submit", handleNickname);
roomNameForm.addEventListener("submit", handleRoomName);

//callPage

function settingCameraList() {
  myCameraList = myDevices.filter((device) => device.kind === "videoinput");
  myCameraList.forEach((camera) => {
    const option = document.createElement("option");
    option.innerText = camera.label;
    if (camera.label === myMediaStream.getVideoTracks().label) {
      option.selected = true;
    }
    myCameraSelect.appendChild(option);
  });
}

function setttingAudioList() {
  myAudioList = myDevices.filter((device) => device.kind === "audioinput");
  myAudioList.forEach((audio) => {
    const option = document.createElement("option");
    option.innerText = audio.label;
    if (audio.label === myMediaStream.getAudioTracks().label) {
      option.selected = true;
    }
    myAudioSelect.appendChild(option);
  });
}

async function settingMyMediaStream(cameraId, audioId) {
  const initialConstraint = {
    video: true,
    audio: true,
  };
  const currentConstraint = {
    video: {
      deviceId: cameraId ? { exact: cameraId } : undefined,
    },
    audio: {
      deviceId: audioId ? { exact: audioId } : undefined,
    },
  };
  try {
    myDevices = await navigator.mediaDevices.enumerateDevices();
    myMediaStream = await navigator.mediaDevices.getUserMedia(
      cameraId ? currentConstraint : initialConstraint
    );
    if (!cameraId) {
      settingCameraList();
      setttingAudioList();
    }
    myCameraVideo.srcObject = myMediaStream;
  } catch (e) {
    console.log(e);
  }
}

//change Audio, Camera

function getSelectedID() {
  let selectedCamera = myCameraList.filter(
    (camera) => camera.label === myCameraSelect.value
  );
  let selectedAudio = myAudioList.filter(
    (audio) => audio.label === myAudioSelect.value
  );
  return [selectedCamera[0].deviceId, selectedAudio[0].deviceId];
}

function handleMediaChange(event) {
  event.preventDefault();
  let [cameraId, audioId] = getSelectedID();
  settingMyMediaStream(cameraId, audioId);
}

myCameraSelect.addEventListener("change", handleMediaChange);
myAudioSelect.addEventListener("change", handleMediaChange);

// function handleMyCameraBt(event) {
//   event.preventDefault();
//   if (myCamera) {
//     myMediaStream.getVideoTracks()[0].stop();
//     myCamera = false;
//     myVideoOffBt.innerText = "Turn on Camera";
//   } else {
//     getMyMedia();
//     myCamera = true;
//     myVideoOffBt.innerText = "Turn off Camera";
//   }
// }

// function handleMyAudioBt(event) {
//   event.preventDefault();
//   if (myAudio) {
//     myMediaStream.getAudioTracks()[0].stop();
//     myAudio = false;
//     myAudioMuteBt.innerText = "unMute";
//   } else {
//     getMyMedia();
//     myAudio = true;
//     myAudioMuteBt.innerText = "Mute";
//   }
// }

// myVideoOffBt.addEventListener("click", handleMyCameraBt);
// myAudioMuteBt.addEventListener("click", handleMyAudioBt);
