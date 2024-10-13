const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log(__dirname + "/public");
  console.log("hello");
});
