const express = require("express");
const app = express();
app.listen(3001);

app.get("/product/:n", function (req, res) {
  res.json({
    num: req.params.n,
  });
});
