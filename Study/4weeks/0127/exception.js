const express = require("express");
const app = express();
app.use(express.json());
app.listen(3003, console.log("서버가 3003번 포트에서 실행 중입니다."));

const teams = [
  { id: 1, name: "landers" },
  { id: 2, name: "bears" },
  { id: 3, name: "eagles" },
  { id: 4, name: "twins" },
];

// 1. 전체 팀 조회
app.get("/teams", (req, res) => {
  res.json(teams);
});

// 2. 개별 팀 조회
app.get("/teams/:id", (req, res) => {
  let id = req.params.id;
  var findTeam = teams.find((t) => t.id == id);

  if (findTeam) {
    res.json(findTeam);
  } else {
    res.status(404).send("Not found");
  }
});
