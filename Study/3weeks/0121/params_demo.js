const express = require("express");
const app = express();

app.listen(3001, () => {
  console.log("3001 포트에서 서버 구동 중");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// 채널 영상과 타암라인
// 1. https://www.youtube.com/watch?v=hqfN4X9bE6I&t=4425s
app.get("/watch", function (req, res) {
  const { v, t } = req.query;
  console.log(v, t);
  res.json({
    video: v,
    time: t,
  });
});

// 채널 주소 파라미터
// 1. https://www.youtube.com/@SSGLANDERS
app.get("/:nickname", function (req, res) {
  const parmas = req.params;
  res.json({
    chanel: parmas.nickname,
  });
});
