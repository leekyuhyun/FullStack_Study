const express = require("express");
const app = express();
app.use(express.json());
app.listen(3334, console.log("3334 포트에서 서버가 실행 중입니다."));

let db = new Map();
let id = 1;

// 1. 채널 생성
app.post("/channel", (req, res) => {
  const { channelTitle } = req.body;
  if (req.body) {
    db.set(id++, { channelTitle });
    res.status(200).json({
      message: `${channelTitle}님 환영합니다!!`,
    });
  }
});

// 2. 채널 개별 수정
app.put("/channel/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const title = db.get(targetId);

  if (title) {
    newTitle = req.body.channelTitle;
    db.set(targetId, { channelTitle: newTitle });
    res.status(200).json({
      message: `${newTitle}로 변경되었습니다.`,
    });
  }
});

// 3. 채널 개별 삭제
app.delete("/channel/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const channel = db.get(targetId);

  if (channel) {
    db.delete(targetId);
    res.status(200).json({
      message: `${channel.channelTitle}님이 정상적으로 탈퇴되었습니다.`,
    });
  } else {
    res.status(404).json({
      message: "해당 채널을 찾을 수 없습니다.",
    });
  }
});

// 4. 채널 전체 조회
app.get("/channels", (req, res) => {
  let channels = [];

  db.forEach(function (value, key) {
    channels.push(value);
  });

  res.status(200).json(channels);
});

// 5. 채널 개별 조회
app.get("/channels/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const channel = db.get(targetId);

  if (channel) {
    res.status(200).json({
      channelTitle: channel.channelTitle,
    });
  } else {
    res.status(404).json({
      message: "일치한 채널명이 없습니다.",
    });
  }
});
