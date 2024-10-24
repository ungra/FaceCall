const landingPageDiv = document.getElementById("landingPage");
const callPageDiv = document.getElementById("callPage");
const beforeNNDiv = document.getElementById("beforeNickname");
const afterNNDiv = document.getElementById("afterNickname");
const nicknameForm = document.getElementById("nickname");
const roomNameForm = document.getElementById("roomName");
const roomListh3 = document.getElementById("roomList");
const myCameraVideo = document.getElementById("myCamera");
const peerCameraVideo = document.getElementById("peerCamera");
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
let myCamera = true;
let myAudio = true;
let myPeerConnection;

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

socket.on("welcome", async () => {
  console.log("someone joined");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("send the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  console.log("received offer");
  myPeerConnection.setRemoteDescription(offer);
  console.log("offer:", offer);
  const answer = await myPeerConnection.createAnswer();
  console.log("send the answer");
  socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
  console.log("receiced the answer");
  myPeerConnection.setRemoteDescription(answer);
  console.log("answer:", answer);
});

socket.on("ice", (ice) => {
  console.log("receiced the ice", ice);
  myPeerConnection.addIceCandidate(ice);
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
async function handleRoomName(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  console.log(`submit Room Name: ${input.value}`);
  roomName = input.value;
  await initCallPage();
  const li = document.createElement("li");
  li.innerText = roomName;
  roomListh3.appendChild(li);
  input.value = "";
  landingPageDiv.hidden = true;
  callPageDiv.hidden = false;
  socket.emit("join_room", roomName);
}
async function initCallPage() {
  const roomNameh2 = document.createElement("h2");
  roomNameh2.innerText = `RoomName : ${roomName}`;
  callPage.prepend(roomNameh2);
  nicknameh2 = document.createElement("h2");
  nicknameh2.innerText = `My NickName : ${myNickname}`;
  callPage.prepend(nicknameh2);
  await settingMyMediaStream();
  makeConnection();
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
    if (!cameraId && !audioId) {
      settingCameraList();
      setttingAudioList();
    }
    myCameraVideo.srcObject = myMediaStream;
    checkMuteAndCameraOff();
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

//click mute, camera turn off

function checkMuteAndCameraOff() {
  if (!myCamera) {
    myMediaStream.getVideoTracks()[0].stop();
  }
  if (!myAudio) {
    myMediaStream.getAudioTracks()[0].stop();
  }
}

function handleCameraOff(event) {
  event.preventDefault();
  let [cameraId, audioId] = getSelectedID();
  if (myCamera) {
    myMediaStream.getVideoTracks()[0].stop();
    myCamera = false;
    myCameraOffBtn.innerText = "Turn on Camera";
  } else {
    if (myAudio) {
      settingMyMediaStream(cameraId, audioId);
    } else {
      settingMyMediaStream(cameraId, null);
    }
    myCamera = true;
    myCameraOffBtn.innerText = "Turn off Camera";
  }
}

function handleMute(event) {
  event.preventDefault();
  let [cameraId, audioId] = getSelectedID();
  if (myAudio) {
    myMediaStream.getAudioTracks()[0].stop();
    myAudio = false;
    myAudioMuteBtn.innerText = "unMute";
  } else {
    if (myCamera) {
      settingMyMediaStream(cameraId, audioId);
    } else {
      settingMyMediaStream(null, audioId);
    }

    myAudio = true;
    myAudioMuteBtn.innerText = "Mute";
  }
}

myCameraOffBtn.addEventListener("click", handleCameraOff);
myAudioMuteBtn.addEventListener("click", handleMute);

//WebRTC code

function handleIce(event) {
  console.log("send the ice", event.candidate);
  socket.emit("ice", event.candidate, roomName);
}

function handleAddstream(event) {
  console.log("addstream");
  peerCameraVideo.srcObject = event.stream;
}

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddstream);
  myMediaStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myMediaStream);
  });
}
