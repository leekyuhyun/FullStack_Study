const express = require("express");
const router = express.Router();
const conn = require("../db-connect");
const { body, param, validationResult } = require("express-validator"); // 1. param 추가

router.use(express.json());

// 에러 확인 공통 로직
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

// 1. 모든 채널 조회
router.get("/channels", (req, res) => {
  conn.query(`SELECT * FROM Channels`, function (err, results) {
    if (results.length) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "조회할 채널이 없습니다." });
    }
  });
});

// 2. 채널 개별 생성
router.post(
  "/channel",
  [
    body("user_id").notEmpty().isInt().withMessage("userId must be a number"),
    body("channel_name")
      .notEmpty()
      .isString()
      .withMessage("channel_name must be a string"),
    validate,
  ],
  (req, res) => {
    const { channel_name, user_id } = req.body;
    const sql = `INSERT INTO Channels (channel_name, user_id) VALUES (?, ?)`;
    conn.query(sql, [channel_name, user_id], function (err, results) {
      if (err) return res.status(500).json(err);
      res.status(201).json(results);
    });
  },
);

// 3. 회원별 채널 조회
router.get(
  "/channels/:user_id",
  [
    param("user_id").isInt().withMessage("유저 아이디는 숫자여야 합니다."),
    validate,
  ],
  (req, res) => {
    const { user_id } = req.params;
    const sql = `SELECT * FROM Channels WHERE user_id = ?`;
    conn.query(sql, [user_id], function (err, results) {
      if (err) return res.status(500).json(err);
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "소유하신 채널이 없습니다." });
      }
    });
  },
);

// 4. 채널 개별 수정
router.put(
  "/channel/:channel_id",
  [
    param("channel_id").isInt().withMessage("채널 ID는 숫자여야 합니다."),
    body("channel_name")
      .notEmpty()
      .isString()
      .withMessage("채널명은 문자열이어야 합니다."),
    validate,
  ],
  (req, res) => {
    const { channel_id } = req.params;
    const { channel_name } = req.body;
    const sql = `UPDATE Channels SET channel_name = ? WHERE channel_id = ?`;
    conn.query(sql, [channel_name, channel_id], function (err, results) {
      if (err) return res.status(500).json(err);
      if (results.affectedRows) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "수정할 채널을 찾을 수 없습니다." });
      }
    });
  },
);

// 5. 채널 개별 삭제
router.delete(
  "/channel/:channel_id",
  [
    param("channel_id").isInt().withMessage("채널 ID는 숫자여야 합니다."),
    validate,
  ],
  (req, res) => {
    const { channel_id } = req.params;
    const sql = `DELETE FROM Channels WHERE channel_id = ?`;
    conn.query(sql, [channel_id], function (err, results) {
      if (err) return res.status(500).json(err);
      if (results.affectedRows) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "삭제할 채널을 찾을 수 없습니다." });
      }
    });
  },
);

module.exports = router;
