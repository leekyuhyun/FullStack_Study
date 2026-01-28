const express = require("express");
const app = express();
app.use(express.json());
app.listen(3333, console.log("3333포트로 서버 실행 중입니다"));

let db = new Map();
let id = 1;

// 1. 로그인
app.post("/login", (req, res) => {
  // 필드가 비었는지 확인
  if (isEmpty(req.body)) {
    return res.status(400).json({
      message: "입력된 정보가 없습니다. 아이디와 비밀번호를 입력해주세요.",
    });
  }

  const { user_id, pwd } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: "아이디를 입력해주세요.",
    });
  }

  if (!pwd) {
    return res.status(400).json({
      message: "비밀번호를 입력해주세요.",
    });
  }

  // 아이디, 비밀번호가 일치한지 확인
  let loginUser = null;

  db.forEach((user) => {
    if (user.user_id === user_id) {
      loginUser = user;
    }
  });
  if (loginUser) {
    if (loginUser.pwd == pwd) {
      res.status(200).json({
        message: `${loginUser.name}님 반갑습니다.`,
      });
    } else {
      res.status(400).json({
        message: "비밀번호를 다시 확인해보세요.",
      });
    }
  } else {
    res.status(400).json({
      message: "아이디를 다시 확인해보세요.",
    });
  }
});

// 1.1 Object.keys() 사용을 위해 isEmpty 함수 추가
function isEmpty(obj) {
  // 객체 안에 이름표(Key)가 하나도 없으면 true(비어있음)를 반환
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

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
