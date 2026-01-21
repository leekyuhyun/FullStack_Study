const express = require("express");
const app = express();
app.listen(3001);

app.get("/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);
  res.json({
    id: id,
    food: db.get(id),
  });
});

let db = new Map();
db.set(1, "Kimchi");
db.set(2, "Bibimbap");
db.set(3, "Bulgogi");
