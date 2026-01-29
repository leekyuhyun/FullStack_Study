# Server와 Router의 역할

- Server : Request를 받음
- Router : Request의 URL에 따라 루트(route)를 정해줌 = 어디로 갈지만 정해줌

## 라우팅이란?

- Request(요청)이 날라왔을 때, 원하는 경로에 따라 적절한 방향으로 경로를 안내해주는 것

## 로그인, 채널 API를 라우터로 사용하기

1. app.js 파일을 생성

```javascript
const express = require("express");
const app = express();

const userRouter = require("../routes/User");
const channelRouter = require("../routes/Channel");

app.use(express.json());
app.use("/", userRouter);
app.user("/", channelRouter);
app.listen(3334, console.log("3334번 포트에서 서버가 실행중입니다."));
```

2. user, router 코드 수정

```javascript
const router = express.Router();
router.use(express.json());

module.exports = router;
```

### 설명

1. 메인 서버(app.js)의 변화: app.use()의 역할
   기존에 한 파일에 모든 기능을 넣었던 방식에서, 라우터 파일을 분리하면서 app.js는 "길잡이" 역할을 하게 되었음.
   - 라우터 모듈 불러오기
     `require`를 통해 분리된 `User.js`와 `Channel.js` 파일을 가져옴.
   - `app.use()`를 통한 연결
     a`pp.use("/", userRouter)`는 "앞으로 들어오는 모든 요청(/) 중에서 `userRouter`에 정의된 경로가 있다면 그쪽으로 보내줘"라는 의미
   - 미들웨어 `express.json()`: 클라이언트가 보낸 JSON 데이터를 서버가 읽을 수 있도록 변환해주는 설정입니다.
     라우터 연결 전에 선언되어야 모든 라우터에서 JSON 데이터를 사용할 수 있음

2. 라우터 파일`(routes/*.js)`의 핵심 코드 설명
   라우터 파일 내부에서는 express.Router()를 사용하여 작은 단위의 설계도를 그림
   - `express.Router()`
     `express` 전체 객체가 아닌 라우팅 기능만 따로 떼어온 객체, 이를 통해 기능을 모듈화할 수 있음
   - `module.exports = router`: 이 코드가 가장 중요합니다. 파일 안에서 정의한 `router `객체를 외부(`app.js`)에서 사용할 수 있도록 밖으로 내보내는 역할을 함
   - 경로 매개변수 (`:id`): `router.get("/user/:id", ...)` 처럼 사용하며, URL을 통해 들어오는 동적인 값을 `req.params.id`로 받아와서 처리할 수 있게 합니다.

# 회원마다 채널 가지게 하기

[👉🏻 확인하러 가기] (https://velog.io/@leekh010502/%ED%9A%8C%EC%9B%90-%EC%B1%84%EB%84%90-API-%EA%B3%A0%EB%8F%84%ED%99%94)

## 오늘 배운 점

1. 관심사 분리 (Modularization)
   app.js는 전체 경로를 안내하는 '지도' 역할만 하고, 실제 상세 로직은 기능별(User, Channel) '전문 라우터' 파일로 나눠서 관리

2. Express Router 활용
   express.Router()를 통해 독립적인 미니 설계도를 만들고, module.exports로 내보내어 코드의 재사용성과 가독성을 높임
