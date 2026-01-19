const express = require("express");
const app = express();
const port = 3001;

//GET +"/"  "http://localhost:3001/"
app.get("/", function (req, res) {
  res.send("Hello, World!");
});

//API : GET + "http://localhost:3001/test"
app.get("/test", function (req, res) {
  res.send("This is a test endpoint.");
});

//API : GET + "http://localhost:3001/test/1"
app.get("/test/1", function (req, res) {
  res.send("This is a test/1 endpoint.");
});

app.get("/test/2", function (req, res) {
  let data = {
    name: "kyulee",
    age: 26,
    city: "New York",
  };
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
