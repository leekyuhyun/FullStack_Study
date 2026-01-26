const express = require("express");
const app = express();

app.use(express.json());
app.listen(3001, () => console.log("서버가 3001번 포트에서 실행 중입니다."));

// 데이터 초기화
const db = new Map();
let id = 1;

db.set(id++, {
  channelTitle: "SSG랜더스",
  subscribers: "21.4만명",
  videoNum: "4.2천개",
});
db.set(id++, {
  channelTitle: "튜브김민교",
  subscribers: "77.6만명",
  videoNum: "1.9천개",
});
db.set(id++, {
  channelTitle: "두치와뿌꾸",
  subscribers: "88.7만명",
  videoNum: "1.9만개",
});

// --- API 경로 시작 ---

// 1. 전체 유튜버 조회
app.get("/youtubers", (req, res) => {
  let youtubers = {};
  db.forEach((value, key) => {
    youtubers[key] = value;
  });
  res.json(youtubers);
});

// 2. 개별 유튜버 조회
app.get("/youtubers/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const youtuber = db.get(targetId);

  if (youtuber) {
    res.json(youtuber);
  } else {
    res.status(404).json({ message: "유튜버 정보를 찾을 수 없습니다." });
  }
});

// 3. 유튜버 등록
app.post("/youtubers", (req, res) => {
  const { channelTitle } = req.body;
  if (!channelTitle) {
    return res.status(400).json({ message: "채널명을 입력해주세요." });
  }

  db.set(id++, req.body);
  res.status(201).json({
    message: `${channelTitle}님, 등록되었습니다.`,
  });
});

// 4. 유튜버 정보 수정 (PUT)
app.put("/youtubers/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const youtuber = db.get(targetId);

  if (youtuber) {
    const oldTitle = youtuber.channelTitle;
    const newTitle = req.body.channelTitle;

    db.set(targetId, req.body); // Map의 set은 키가 있으면 덮어씁니다.
    res.json({
      message: `${oldTitle}님의 정보가 ${newTitle}로 수정되었습니다.`,
    });
  } else {
    res.status(404).json({ message: "수정할 유튜버가 없습니다." });
  }
});

// 5. 유튜버 전체 삭제 (DELETE)
app.delete("/youtubers", (req, res) => {
  if (db.size > 0) {
    db.clear();
    res.json({
      message: "전체 유튜버 정보가 성공적으로 삭제되었습니다.",
    });
  } else {
    res.status(404).json({
      message: "삭제할 유튜버 정보가 이미 없습니다.",
    });
  }
});

// 6. 개별 유튜버 삭제 (DELETE)
app.delete("/youtubers/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const youtuber = db.get(targetId);

  if (youtuber) {
    db.delete(targetId);
    res.json({ message: `${youtuber.channelTitle}님이 삭제되었습니다.` });
  } else {
    res.status(404).json({ message: "삭제할 유튜버가 없습니다." });
  }
});
