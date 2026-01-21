const express = require("express");
const app = express();
app.listen(3001);

app.get("/", (req, res) => {
  res.send("Hello World");
});

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

app.get("/:nickname", (req, res) => {
  const { nickname } = req.params;

  if (nickname == "@SSGLANDERS") {
    res.json({ youtuber: youtuber.user01 });
  } else if (nickname == "@Onepunchk1ng_mk") {
    res.json({ youtuber: youtuber.user02 });
  } else if (nickname == "@두치와뿌꾸") {
    res.json({ youtuber: youtuber.user03 });
  } else {
    res.json({ message: "등록되지 않은 유튜버입니다." });
  }
});
