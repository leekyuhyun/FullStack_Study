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
db.set("@SSGLADERS", youtuber1);
db.set("@Onepunchk1ng_mk", youtuber2);
db.set("@두치와뿌꾸", youtuber3);
// REST API 설계
app.get("/youtuber/:id", (req, res) => {
  const { id } = req.params;
  const youtuberId = db.get(id);

  if (youtuberId == undefined) {
    res.json({ message: "등록되지 않은 유튜버입니다." });
  } else {
    res.json(youtuberId);
  }
});
