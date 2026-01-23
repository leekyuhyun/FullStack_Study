const express = require("express");
const app = express();
app.listen(3001);

let youtuber = {
  user01: {
    channelTitle: "SSG랜더스",
    subscribers: "21.4만명",
    videoNum: "4.2천개",
  },
  user02: {
    channelTitle: "튜브김민교",
    subscribers: "77.6만명",
    videoNum: "1.9천개",
  },
  user03: {
    channelTitle: "두치와뿌꾸",
    subscribers: "88.7만명",
    videoNum: "1.9만개",
  },
};

const db = new Map();
db.set("@15ya", youtuber.user01);
db.set("@chimchakman", youtuber.user02);
db.set("@teo", youtuber.user03);

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
