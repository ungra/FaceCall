const landingPage = document.getElementById("landingPageDiv");
const callPage = document.getElementById("callPageDiv");
const submitNickName = document.getElementById("submitNicknameDiv");
const submitedNickName = document.getElementById("submittedUserNickNameDiv");
const nickNameForm = document.getElementById("nickNameForm");

let myNickname;

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

//video
const myVideo = document.getElementById("mycamera");

async function getMyCamera() {
  const myMediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  myVideo.srcObject = myMediaStream;
}
// getMyCamera();

//landing page
function handleNickname(event) {
  event.preventDefault();
  console.log("handle Nick Name");
  const input = nickNameForm.querySelector("input");
  myNickname = input.value;
  submitNickName.hidden = true;
  submitedNickName.hidden = false;
  const h3 = document.createElement("h3");
  h3.innerText = `User Nickname : ${myNickname}`;
  submitedNickName.appendChild(h3);
  input.value = "";
}
nickNameForm.addEventListener("submit", handleNickname);
console.log(myNickname);
