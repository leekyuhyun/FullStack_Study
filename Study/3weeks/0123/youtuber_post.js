const express = require("express");
const app = express();
app.listen(3001);

let youtuber1 = {
  channelTitle: "SSG랜더스",
  subscribers: "21.4만명",
  videoNum: "4.2천개",
};

let youtuber2 = {
  channelTitle: "튜브김민교",
  subscribers: "77.6만명",
  videoNum: "1.9천개",
};

let youtuber3 = {
  channelTitle: "두치와뿌꾸",
  subscribers: "88.7만명",
  videoNum: "1.9만개",
};

const db = new Map();
var id = 1;
db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

app.get("/youtuber/:id", (req, res) => {
  const { id } = req.params;
  const youtuberId = db.get(parseInt(id));
  res.json(youtuberId);
});

app.get("/youtuber/all", (req, res) => {
  res.json(db);
});

app.use(express.json()); // http 외 모듈인 '미들웨어' : json 설정
app.post("/youtuber", (req, res) => {
  db.set(id++, req.body);
  res.json({
    message: `${db.get(id - 1).channelTitle}님, 등록되었습니다.`,
    youtuber: req.body,
  });
});
