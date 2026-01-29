const express = require("express");
const router = express.Router();
router.use(express.json());

let db = new Map();
let id = 1;

// 1. 채널 생성
router.post("/channel", (req, res) => {
  const { channelTitle, user_id } = req.body;
  if (req.body) {
    db.set(id++, { channelTitle, user_id: user_id });
    res.status(200).json({
      message: `${channelTitle}님 환영합니다!!`,
    });
  }
});

// 2. 채널 개별 수정
router.put("/channel/:id", (req, res) => {
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
router.delete("/channel/:id", (req, res) => {
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

// 4. 회원의 채널 전체 조회
router.get("/channels", (req, res) => {
  const { user_id } = req.body;
  let channels = [];

  if (user_id) {
    db.forEach(function (value, key) {
      if (value.user_id == user_id) {
        channels.push(value);
      }
    });
  }
  res.status(200).json(channels);
});

// 5. 채널 개별 조회
router.get("/channels/:id", (req, res) => {
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

module.exports = router;
