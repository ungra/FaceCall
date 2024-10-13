const express = require("express");
const app = express();

const http = require("http");
const server = http.Server(app);

const socket = require("socket.io");
const io = socket(server);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(3000, () => {
  console.log(__dirname + "/public");
  console.log("hello");
});

io.on("connetion", () => {
  console.log("someone join");
});
