const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socket(server);

let roomList = {};

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(3000, () => {
  console.log("server start");
});

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("disconnecting", () => {
    console.log("disconnecting!!");
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("bye");
        socket.leave(room);
        if (roomList[room]) {
          roomList[room] -= 1;
          if (roomList[room] === 0) {
            delete roomList[room];
          }
        }
      }
    });
    socket.broadcast.emit("roomList", roomList);
  });
  socket.on("getRoomList", () => {
    socket.emit("roomList", roomList);
  });
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    if (!roomList[roomName]) {
      roomList[roomName] = 1;
    } else {
      roomList[roomName]++;
    }
    socket.to(roomName).emit("welcome");
    socket.broadcast.emit("roomList", roomList);
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});
