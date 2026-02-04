const express = require("express");
const router = express.Router();
const conn = require("../5weeks/0203/db-connect");

router.use(express.json());

// 1. 모든 채널 조회
router.get("/channels", (req, res) => {
  conn.query(`SELECT * FROM Channels`, function (err, results) {
    if (results.length) {
      res.status(200).json(results);
    } else {
      res.status(404).json({
        message: "조회할 채널이 없습니다.",
      });
    }
  });
});

// 2. 채널 개별 생성
router.post("/channel", (req, res) => {
  const { channel_name, user_id } = req.body;
  if (channel_name && user_id) {
    conn.query(
      `INSERT INTO Channels (channel_name, user_id) values (?, ?)`,
      [channel_name, user_id],
      function (err, results) {
        res.status(201).json(results);
      },
    );
  } else {
    res.status(400).json({
      message: "입력값을 확인해주세요.",
    });
  }
});

// 3. 회원별 채널 조회
router.get("/channels/user", (req, res) => {
  const { user_id } = req.body;
  if (user_id) {
    conn.query(
      `SELECT * FROM Channels WHERE user_id = ?`,
      [user_id],
      function (err, results) {
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(404).json({
            message: "소유하신 채널이 없습니다.",
          });
        }
      },
    );
  } else {
    res.status(400).json({
      message: "유저 아이디를 입력해주세요.",
    });
  }
});

// 4. 채널 개별 조회
router.get("/channel/:id", (req, res) => {
  const { id } = req.params;
  conn.query(
    `SELECT * FROM Channels WHERE channel_id = ?`,
    [id],
    function (err, results) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "일치하는 채널 정보가 없습니다.",
        });
      }
    },
  );
});

// 5. 채널 개별 수정
router.put("/channel/:id", (req, res) => {
  const { id } = req.params;
  const { channel_name } = req.body;
  conn.query(
    `UPDATE Channels SET channel_name = ? WHERE channel_id = ?`,
    [channel_name, id],
    function (err, results) {
      if (results.affectedRows) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "수정할 채널을 찾을 수 없습니다.",
        });
      }
    },
  );
});

// 6. 채널 개별 삭제
router.delete("/channel/:id", (req, res) => {
  const { id } = req.params;
  conn.query(
    `DELETE FROM Channels WHERE channel_id = ?`,
    [id],
    function (err, results) {
      if (results.affectedRows) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "삭제할 채널이 없습니다.",
        });
      }
    },
  );
});

module.exports = router;
