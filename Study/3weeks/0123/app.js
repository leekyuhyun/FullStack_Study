const express = require("express");
const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("안녕하세요!! Postman으로 테스트중입니다");
});

app.post("/test", (req, res) => {
  res.send("테스트용 페이지입니다.");
});

app.use(express.json()); // 미들웨어
app.post("/data", (req, res) => {
  // body에 숨겨져서 들어온 데이터를 화면에 출력
  res.send(req.body.message);
});

app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
});
