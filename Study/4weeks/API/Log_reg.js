const express = require("express");
const app = express();
app.use(express.json());
app.listen(3333, console.log("3333포트로 서버 실행 중입니다"));

let db = new Map();
let id = 1;

// 1. 로그인
app.post("/login", (req, res) => {
  //다음 시간에 구현 예정
});

// 2. 회원가입
app.post("/register", (req, res) => {
  const { user_id, pwd, name } = req.body;
  if (user_id && pwd && name) {
    db.set(id++, { user_id, pwd, name });
    res.status(201).json({
      message: `${db.get(id - 1).name}님 환영합니다.`,
    });
  } else {
    res.status(400).json({
      message: "입력값을 확인해주세요.",
    });
  }
});

// 3. 회원 개별 조회
app.get("/user/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const user = db.get(targetId);

  if (user) {
    res.status(200).json({
      userId: user.user_id,
      username: user.name,
    });
  } else {
    res.status(404).json({
      message: "일치한 회원 정보가 없습니다.",
    });
  }
});

// 4. 회원 개별 탈퇴
app.delete("/user/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const user = db.get(targetId);
  if (user) {
    db.delete(targetId);
    res.status(200).json({
      message: `${user.name}님이 탈퇴했습니다.`,
    });
  } else {
    res.status(404).json({
      message: "일치하는 회원 정보가 없습니다.",
    });
  }
});
