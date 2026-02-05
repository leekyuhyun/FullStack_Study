const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const conn = require("../db-connect");

const { body, param, validationResult } = require("express-validator");

dotenv.config();

router.use(express.json());
router.use(cookieParser());

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

// 1. 로그인
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("올바른 이메일 형식이 아닙니다."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 입력해주세요."),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM Users WHERE email = ? AND password = ?`;

    conn.query(sql, [email, password], function (err, results) {
      if (err) return res.status(500).json(err);

      if (results.length) {
        const loginUser = results[0];

        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "3m",
            issuer: "kyuhyun",
          },
        );

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json({
          message: `${loginUser.name}님, 환영합니다!`,
        });
      } else {
        res.status(401).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
      }
    });
  },
);

// 2. 회원가입
router.post(
  "/register",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요."),
    body("name").notEmpty().isString().withMessage("이름을 확인해주세요."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요."),
    body("phone").notEmpty().withMessage("전화번호를 확인해주세요."),
    validate,
  ],
  (req, res) => {
    const { email, name, password, phone } = req.body;
    const sql = `INSERT INTO Users (email, name, password, phone) VALUES (?, ?, ?, ?)`;
    const values = [email, name, password, phone];

    conn.query(sql, values, function (err, results) {
      if (err) return res.status(500).json(err);
      res.status(201).json(results);
    });
  },
);

// 3. 회원 개별 조회
router.get(
  "/user/:email",
  [
    param("email").isEmail().withMessage("올바른 이메일 형식이 아닙니다."),
    validate,
  ],
  (req, res) => {
    const { email } = req.params;
    const sql = `SELECT * FROM Users WHERE email = ?`; // SQL 인젝션 방지를 위해 ? 사용 권장

    conn.query(sql, [email], function (err, results) {
      if (err) return res.status(500).json(err);

      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "회원 정보가 없습니다." });
      }
    });
  },
);

// 4. 회원 개별 탈퇴
router.delete(
  "/user/:email",
  [
    param("email").isEmail().withMessage("올바른 이메일 형식이 아닙니다."),
    validate,
  ],
  (req, res) => {
    const { email } = req.params;
    const sql = `DELETE FROM Users WHERE email = ?`;

    conn.query(sql, [email], function (err, results) {
      if (err) return res.status(500).json(err);

      if (results.affectedRows) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "일치하는 회원 정보가 없습니다." });
      }
    });
  },
);

module.exports = router;
