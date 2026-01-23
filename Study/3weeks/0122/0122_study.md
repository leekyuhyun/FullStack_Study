## express + map + 객체

- 객체 (Object)
  음식의 이름(name)과 가격(price)처럼 연관된 여러 정보를 하나의 덩어리로 묶어주는 역할을 함

- Map
  데이터를 저장할 때 '번호(Key)'와 '내용(Value)'을 쌍으로 저장하는 보관함입니다. 일반 객체보다 데이터 추가, 삭제가 빠르고 순서가 보장되는 장점이 있음

- Express (라우팅)
  주소창에 입력된 번호(:id)를 받아 Map에서 해당 데이터를 찾아 사용자에게 보내주는 통로 역할을 함

```javascript
// 1. 데이터 본체 준비 (객체 활용)
let kimchi = {
  name: "Kimchi",
  price: 5000,
};

let Bibimbap = {
  name: "Bibimbap",
  price: 8000,
};

let Bulgogi = {
  name: "Bulgogi",
  price: 12000,
};

// 2. 데이터 저장소 구축 (Map 활용)
let db = new Map();
db.set(1, kimchi);
db.set(2, Bibimbap);
db.set(3, Bulgogi);

// 3. API 경로 설정 (Express 라우팅)
app.get("/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  if (db.get(id) === undefined) {
    res.json({
      message: "없는 음식입니다.",
    });
  } else
    res.json({
      id: id,
      food: db.get(id),
    });
});
```

![](https://velog.velcdn.com/images/leekh010502/post/bf3ac478-ca93-4a1e-a3a7-ff2c8eb214a5/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/e054a830-cf99-48bd-9552-f048dad1b77b/image.png)

## express 구조

express-generator를 통하여 express의 구조를 알아보기

### 설치

1. 터미널에 다음과 같은 명령어를 입력
   `npm install -g express-generator`

2. 프로젝트를 생성하고 싶은 위치로 이동 (생략 가능)
   `ex) cd Study/3weeks/0122`

3. 프로젝트 생성
   `exoress (폴더 이름)`

### 핵심파일 훑어보기

#### 1. bin/www (서버를 실행하는 '엔진')

실제 HTTP 서버를 생성하고 포트를 지정하여 요청을 기다리는 역할을 함

```javascript
// bin/www 파일의 핵심 부분
var app = require("../app"); // 설계도(app.js)를 가져옴
var http = require("http");

// 1. 포트 설정 (기본 3000번)
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// 2. 진짜 HTTP 서버 생성
var server = http.createServer(app);

// 3. 서버 실행 및 대기 시작
server.listen(port);
```

- 역할
  app.js에서 작성한 로직을 가져와서 실제로 웹상에 띄우는 전원 스위치

- 특징
  포트 번호 변경이나 서버 실행 시 발생하는 오류를 관리

#### 2. app.js (전체적인 '연결 설계도')

서버의 모든 설정과 미들웨어를 연결하는 중심지

```javascript
// app.js 파일의 핵심 부분
var express = require("express");
var path = require("path");
var indexRouter = require("./routes/index"); // 라우터 파일 연결

var app = express();

// 1. 미들웨어 설정 (데이터 해석 도구들)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__context, "public"))); // 정적 파일 경로

// 2. 라우팅 연결 (주소별 로직 연결)
app.use("/", indexRouter);

// 3. 에러 처리
app.use(function (req, res, next) {
  next(createError(404)); // 페이지 없을 때 404 에러 발생
});

module.exports = app; // 이 설계도를 bin/www에서 쓸 수 있게 내보냄
```

- 역할
  요청이 들어왔을 때 어떤 길(Route)로 보낼지, 데이터를 어떻게 가공할지 결정하는 중앙 통제실입니다.

- 특징
  module.exports = app;을 통해 서버 구동 로직(bin/www)과 서버 설정 로직(app.js)을 분리하여 관리합니다.

### 자바스크립트 함수 4가지 종류

1. 함수 선언문 (기본형)
   어디서든 부를 수 있는 가장 정석적인 방법

```javascript
function add(a, b) {
  return a + b;
}
```

2. 함수 표현식 (익명 함수)
   변수에 함수를 쑥 집어넣은 형태

```javascript
const add = function (a, b) {
  return a + b;
};
```

3. 화살표 함수 (기본)
   `function` 글짜 쓰기 귀찮을 때 쓰는 현대적인 방식

```javascript
const add = (a, b) => {
  return a + b;
};
```

4. 화살표 함수 (축약형)
   파라미터가 1개면 괄호`()` 생략, 코드가 리턴 한 줄이면 중괄호 `{}`와 `return`까지 생략 가능

```javascript
const add = (a, b) => a + b;
```

### 오늘 배운 점

1. 데이터 구조화
   단순 문자열 대신 객체를 저장해 API 정보를 풍부하게 만들었음

2. 서버 아키텍처
   제너레이터를 통해 실행(bin/www)과 설정(app.js)이 분리된 표준 구조를 이해

3. 문법 숙달
   상황에 맞는 함수 작성법과 Map의 엄격한 데이터 타입 구분(형변환 필요성)을 익혔음
