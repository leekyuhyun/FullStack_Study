const express = require("express");
const app = express();
app.listen(3001);

let kimchi = {
  name: "Kimchi",
  price: 5000,
};

let Bibimbap = {
  name: "Bibimbap",
  price: 8000,
};

let Bulgogi = {
  name: "Bulgogi",
  price: 12000,
};

let db = new Map();
db.set(1, kimchi);
db.set(2, Bibimbap);
db.set(3, Bulgogi);

app.get("/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  if (db.get(id) === undefined) {
    res.json({
      message: "없는 음식입니다.",
    });
  } else
    res.json({
      id: id,
      food: db.get(id),
    });
});
