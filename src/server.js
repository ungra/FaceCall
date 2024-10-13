const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socket(server);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(3000, () => {
  console.log(__dirname + "/public");
});

io.on("connetion", (socket) => {
  console.log("someone join");
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
});
