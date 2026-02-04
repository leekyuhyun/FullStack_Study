const express = require("express");
const router = express.Router();

const conn = require("../5weeks/0203/db-connect");

router.use(express.json());

// 1. 로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // 필드가 비었는지 확인
  if (!email && !password) {
    return res.status(400).json({
      message: "입력된 정보가 없습니다. 아이디와 비밀번호를 입력해주세요.",
    });
  }

  if (!email) {
    return res.status(400).json({
      message: "아이디를 입력해주세요.",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "비밀번호를 입력해주세요.",
    });
  }

  conn.query(
    `SELECT name FROM Users WHERE email = ? AND password = ?`,
    [email, password],
    function (err, results, fields) {
      res.status(200).json(results);
    },
  );
});

// 2. 회원가입
router.post("/register", (req, res) => {
  const { email, name, password, phone } = req.body;
  if (email && name && password) {
    conn.query(
      `INSERT INTO Users (email, name, password, phone) values (?, ?, ?, ?)`,
      [email, name, password, phone],
      function (err, results, fields) {
        res.status(201).json(results);
      },
    );
  } else {
    res.status(400).json({
      message: "입력값을 확인해주세요.",
    });
  }
});

// 3. 회원 개별 조회
router.get("/user/:email", (req, res) => {
  const { email } = req.params;
  conn.query(
    `SELECT * FROM Users where email = '${email}'`,
    function (err, results, fields) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "회원 정보가 없습니다.",
        });
      }
    },
  );
});

// 4. 회원 개별 탈퇴
router.delete("/user/:email", (req, res) => {
  const { email } = req.params;
  if (email) {
    conn.query(
      `DELETE FROM Users WHERE email = ?`,
      email,
      function (err, results, fields) {
        res.status(200).json(results);
      },
    );
  } else {
    res.status(404).json({
      message: "일치하는 회원 정보가 없습니다.",
    });
  }
});

module.exports = router;
