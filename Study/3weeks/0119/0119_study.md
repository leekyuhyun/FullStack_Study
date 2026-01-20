## Express, REST API 실습, Json

### HTTP vs Express

- **HTTP**
  - Node.js 설치 시 기본적으로 제공되는 가장 기초적인 모듈
- **Express**
  - HTTP 모듈을 기반으로, 개발자가 더 편하게 웹 서비스를 만들 수 있게 추상화한 프레임워크

### Express 설치 및 확인

`npm install express`

- 확인

```javascript
//express_demo.js
const express = require("express"); //(1)
const app = express(); //(2)

app.get("/", (req, res) => {
  //(3)
  res.send("Hello, World!");
}); //(4)

app.listen(3001); //(5)
```

- (1) 외부 모듈 불러오기
  - require("express")를 통해 설치한 Express 패키지를 가져옴

- (2) Express 애플리케이션 생성
  - express() 함수를 호출하여 새로운 Express 어플리케이션 객체를 만듬, 이 app 객체는 서버를 설정하고 관리하는 핵심 엔진 역할을 함

- (3) 라우팅 설정 (GET 요청)
  - app.get: HTTP 메서드 중 하나인 GET 방식으로 들어오는 요청만 처리하겠다는 뜻
  - "/": 접속할 경로(Root)를 의미, 브라우저에 localhost:3001 뒤에 아무것도 붙이지 않고 들어왔을 때 실행됨
  - (req, res) => { ... }: 해당 경로로 접속했을 때 실행될 함수
    - req (Request): 클라이언트가 보낸 정보가 담겨 있음
    - res (Response): 서버가 클라이언트에게 보낼 응답 도구들이 담겨 있음

- (4) 응답 보내기
  - res.send("Hello, World!")를 호출하면 클라이언트(브라우저)에게 "Hello, World!"라는 문구를 전송하고 연결을 종료, Express가 자동으로 Content-Type을 텍스트로 설정해 주기 때문에 매우 편리

- (5) 서버 대기 (포트 설정)
  - app.listen(3001)은 서버가 3001번 포트에서 클라이언트의 접속을 기다리도록 만듬
  - 성공적으로 실행되면 이제 브라우저에서 서버에 접속할 수 있게 됨

### REST API 실습 (express)

```javascript
//express_demo.js에 추가
//API : GET + "http://localhost:3001/test"
app.get("/test", (req, res) => {
  res.send("This is a test endpoint.");
});

//API : GET + "http://localhost:3001/test/1"
app.get("/test/1", (req, res) => {
  res.send("This is a test/1 endpoint.");
});
```

### 객체란?

- 관련된 데이터와 함수의 집합
- 쉽게 비유하자면 **'사물함'**이나 **'프로필 카드'**와 같음

#### 왜 객체를 사용해야하나?

- 변수 하나에 이름만 담거나, 나이만 담는 것이 아니라 **한 대상에 대한 여러 정보**를 묶어서 관리하기 위해서 사용
  - **변수:** `let name = "leekyuhyun";` (데이터 하나만 저장)
  - **객체:** `let user = { name: "leekyuhyun", age: 26 };` (여러 정보를 한 덩어리로 저장)

#### 객체의 구조 (key-value)

- 객체는 **키(Key)**와 **값(Value)**의 쌍으로 이루어져 있음
  - **키(Key):** 데이터의 이름 (변수 역할)
  - **값(Value):** 실제 데이터 (문자열, 숫자, 함수 등

#### 실습

```javascript
//object_demo.js
const profile = {
  name: "kyulee",
  status: "learning",
  goal: "FullStack",
};

function print(profile) {
  console.log(profile.name);
  console.log(profile.status);
  console.log(profile.goal);
}

print(profile);
```

#### Json으로 보내기

```javascript
const express = require("express");
const app = express();

app.get("/test/2", (req, res) => {
  let data = {
    name: "kyulee",
    age: 26,
    city: "Siheung",
  };
  res.json(data);
});

app.listen(3001);
```

#### Params로 동적 URL 처리

- 쇼핑몰에 등록된 상품이 100개, 혹은 10,000개라고 가정, 만약 상품마다 개별적으로 라우터를 만든다면 코드는 아마 끝도 없이 길어짐

http 모듈을 사용할 때는 Query String 방식을 많이 썼지만 express는 Params를 이용하면 URL 구조가 훨씬 직관적이고 깔끔해짐

- http - Query String 방식:
  /product?id=1

- express - Path Parameter 방식:
  /product/1

- 주소 뒤에 `/:변수명`을 적고 `res.params`로 데이터를 꺼내서 사용

```javascript
//params_demo.js
const express = require("express");
const app = express();
app.listen(3001);

app.get("/product/:n", function (req, res) {
  res.json({
    num: req.params.n,
  });
});
```
