const express = require("express");
const app = express();
app.use(express.json());

const userRouter = require("../routes/User");
const channelRouter = require("../routes/Channel");

app.use("/", userRouter);
app.use("/", channelRouter);
app.listen(3334, console.log("3334번 포트에서 서버가 실행중입니다."));
