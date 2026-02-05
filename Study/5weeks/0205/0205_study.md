# user.js에 validator 추가

어제 배운 express-validator를 user.js에도 적용해보았습니다.

```javascript
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

// 회원가입
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
```

# 인증과 인가

> 인증 (Authentication)은 당신이 누구인지 증명하는 과정이다. (ex: 로그인)
> 서비스에 등록된 사용자인지 확인하여 '신원'을 보증한다.

> 인가 (Authorization)은 허락된 권한이 있는지 확인하는 과정이다. (ex: 관리자 / 일반 로그인의 기능 차이)
> 인증된 사용자가 특정 자원(데이터)에 접근하거나 기능을 실행할 수 있는 '자격'이 있는지 판단한다.

# 쿠키와 세션

## 쿠키 (cookie)

사용자의 브라우저에 저장되는 작은 데이터 조각이다
클라이언트(브라우저)가 보관하고 있다가, 서버에 요청을 보낼 때마다 자동으로 함께 전달된다.

장점

- 서버가 저장하기 않아서 서버의 저장공간을 사용하지 않는다.
- Stateless해서 RESTful하다.

단점

- 사용자 pc에 저장되므로 노출되거나 조작될 위험이 크다.

## 세션 (session)

서버에 저장되는 사용자의 활동 정보
데이터는 서버에 저장하고, 브라우저에는 그 정보를 찾을 수 있는 **'열쇠(Session ID)'**만 쿠키로 보낸다.

장점

- 서버가 관리하기 때문에 보안이 비교적 좋다.
  단점
- 서버의 저장공간을 사용한다.
- Stateless하지 않다.

# JWT (JSON Web Token)

- JSON 형태의 데이터를 안전하게 전송하기 위한 웹 표준 토큰이다.
- 쿠키/세션 방식의 단점을 보완하기 위해 등장하였다.

장점

- 암호화 처리가 되어 있어, 보안에 강하다.
- 서버가 상태를 저장하지 않기 때문에 Stateless하고, 서버에 부담을 줄여줄 수 있다.
- 토큰을 발행하는 서버를 따로 만들 수도 있다.

구조
Header(헤더) : 토큰의 타입(JWT)과 사용할 암호화 알고리즘이 적혀 있다.
Payload(페이로드) : 실제 유저 정보(ID, 이름, 권한 등)가 들어 있다. (누구나 볼 수 있으므로 비밀번호 같은 민감 정보는 절대 넣지 않는다.)
Signature(서명) : 서버만 알고 있는 **비밀키(Secret Key)**로 만든 암호문이다. 토큰이 조작되지 않았음을 증명한다. 페이로드 값이 바뀌면, 서명 값이 통째로 바뀐다.

## JWT 인증-인가 절차

![](https://velog.velcdn.com/images/leekh010502/post/b836fb1c-6f55-44a1-a918-21da55330f2b/image.png)

로그인 요청: 클라이언트가 ID/Password를 담아 서버에 로그인을 요청한다.

토큰 발행: 서버는 내부 로직으로 신원을 확인한 뒤, 로그인 시점이 기록된 **JWT(토큰)**를 발행한다.

토큰 전달: 서버는 클라이언트에게 "당분간 로그인을 유지해주겠다"며 JWT를 동봉해 보낸다.

다음 요청: 클라이언트는 이후 다른 요청을 보낼 때 HTTP 헤더에 JWT를 담아서 함께 보낸다.

서명 확인: 서버는 클라이언트가 가져온 토큰의 서명이 자신이 해준 것이 맞는지 확인한다.

응답: 서명이 일치하면 별도의 로그인 과정 없이 "이미 인증된 유저"로 판단하여 요청을 승인한다.

## JWT 토큰 발급하기

JWT 토큰을 발급하기 위해서 먼저 라이브러리를 설치해야한다.

```bash
npm install jsonwebtoken`
```

jwt 발급

```javascript
var jwt = require("jsonwebtoken");

var token = jwt.sign({ foo: "bar" }, "shhhhh");

console.log(token);

var decoded = jwt.verify(token, "shhhhh");
console.log(decoded);
```

1. JWT 라이브러리 도입
   먼저 `require("jsonwebtoken")`를 통해 JWT 생성과 검증을 도와주는 모듈을 가져온다.

2. 토큰 발급 (`jwt.sign`)
   `jwt.sign()` 함수는 두 가지 핵심 인자를 받는다.
   - Payload: 토큰에 담고 싶은 실제 데이터.
   - Secret Key: 서버만 알고 있어야 하는 암호키. 이 키를 통해 토큰이 조작되지 않았음을 보장하는 **서명(Signature)**을 생성한다.

3. 토큰 검증 (`jwt.verify`)
   발행된 토큰이 유효한지 확인할 때는 `jwt.verify()`를 사용한다.
   - 발행할 때 사용했던 동일한 비밀키를 넣어야만 검증에 성공한다.
   - 만약 토큰의 내용이 중간에 바뀌었거나 비밀키가 틀리다면 에러를 발생시켜 접근을 차단한다.

4. 검증 결과 확인
   검증에 성공하면 `decoded` 변수에는 원래 담았던 데이터와 함께 `iat` (발행 시간) 정보가 객체 형태로 들어온다. 서버는 이 데이터를 보고 "아, 이 유저는 예전에 내가 인증해준 그 유저가 맞구나"라고 판단하게 된다.

![](https://velog.velcdn.com/images/leekh010502/post/bf1db6dd-83d9-498d-822a-f6dd6e6d1735/image.png)

# .env

- **프로젝트의 환경 변수(Environmental Variables)를 관리하는 파일**이다.
  코드에 직접 쓰기엔 민감하거나, 상황에 따라 변해야 하는 설정값들을 따로 모아두는 비밀 메모장이라고 생각하면 쉽다.

- `.env` 파일은 보통 `Key=value`형태로 작성한다.
- 작성시 `Key` 값은 대문자 + SnakeCase로 작성한다. `ex) SECRET_KEY = my_secret_key`
  s

## .env 파일 생성 및 불러오기

.env 파일은 보통 루트 폴더 바로 아래에 생성한다.
Node.js에서는 보통 `dotenv`라는 라이브러리를 사용해 값을 가져온다.

```bash
npm install dotenv
```

.env 파일 만들기

```bash
# JWT 암호키
SECRET_KEY=shhhhh
```

.env 파일을 활용하여 jwt 토큰 발행하기

```javascript
var jwt = require("jsonwebtoken"); // jwt 모듈 소환
var dotenv = require("dotenv"); // dotenv 모듈 소환

dotenv.config({ path: "../../../.env" });

// 서명 = 토큰 발행
var token = jwt.sign({ foo: "bar" }, process.env.SECRET_KEY);
// token 생성 = jwt 서명을 했다! (페이로드 + 나만의 암호키) + SHA256
console.log(token);

// 검증
// 만약 검증에 성공하면, 페이로드 값을 확인할 수 있음
var decoded = jwt.verify(token, process.env.SECRET_KEY);
console.log(decoded);
```

1. 암호키의 외부 분리 (.env 활용)
   기존: 코드에 "shhhhh"라고 직접 적었던 비밀키를 삭제했다.
   변경: .env 파일에 SECRET_KEY를 따로 저장하고 process.env.SECRET_KEY로 불러와 사용한다.

2. 환경 변수 로드 (dotenv 모듈)
   추가: require("dotenv")와 dotenv.config() 코드를 추가했다.
   역할: 외부 파일(.env)에 적힌 설정값들을 읽어와서 실제 코드에서 쓸 수 있게 연결해 주는 다리 역할을 합니다.

3. 정확한 파일 경로 지정 (path 옵션)
   변경: path: "../../../.env" 설정을 추가했다.
   이유: 실행 파일과 .env 파일이 서로 다른 폴더에 있을 때, 상위 폴더로 거슬러 올라가서 설정 파일을 정확히 찾아오도록 길을 안내해준 것이다.

> 만약 .env 파일을 만들고 github에 올라가는 것을 방지하기 위해서 .gitignore에 .env를 추가해야 한다.
> github에는 .env_sample 파일을 만들어서 올리는 것을 추천한다.

# youtube에 쿠키, jwt 적용해보기

쿠키 라이브러리 설치

```bash
npm install cookie-parser
```

## User.js 로그인

우선 User.js에 로그인부터 적용해보겠습니다.

```javascript
// 추가되는 코드
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
router.use(cookieParser());

// 로그인
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
            expiresIn: "30m",
            issuer: "admin",
          },
        );
        // 4. 응답 헤더나 바디에 토큰 실어서 보내기
        res.status(200).json({
          message: `${loginUser.name}님, 환영합니다!`,
          token: token, // 이제 클라이언트는 이 토큰을 저장해두고 사용합니다.
        });
      } else {
        res.status(404).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
      }
    });
  },
);
```

1.  관련 모듈 및 설정 로드
    가장 먼저 JWT 생성에 필요한 `jsonwebtoken`과 환경 변수 관리를 위한 `dotenv`, 그리고 쿠키 처리를 위한 `cookie-parser`를 불러온다.
    특히 `dotenv.config()`를 통해 서버의 비밀키(`SECRET_KEY`)를 안전하게 가져와야한다.

2.  사용자 인증 및 데이터 조회
    클라이언트가 보낸 이메일과 비밀번호를 DB와 대조한다.
    이때 `SELECT *`을 사용하여 사용자의 `email`과 `name` 등 토큰의 내용물(Payload)로 쓸 정보를 함께 가져온다.

3.  JWT 토큰 생성 (`jwt.sign)`
    인증이 완료되면 `jwt.sign()` 함수를 이용해 토큰을 만든다.
    - Payload: 유저를 식별할 수 있는 정보(email, name)를 담는다.

    - Secret Key: 서버만 알고 있는 비밀키로 서명하여 위조를 방지한다.

    - Options: expiresIn을 통해 토큰의 유효기간(예: 30분)을 정한다. 이는 토큰 유출 시 피해를 최소화하는 보안 장치이다.

4.  쿠키에 토큰 설정 (`res.cookie`)
    생성된 토큰을 응답 바디가 아닌 HTTP 헤더의 쿠키에 담아 보낸다.
    - res.cookie("token", token, ...): 클라이언트 브라우저의 쿠키 저장소에 token이라는 이름으로 저장하라고 명령한다.

    - httpOnly: true: 이 옵션은 보안의 핵심이다. 브라우저의 자바스크립트가 이 쿠키를 읽을 수 없게 차단하여, 해커의 스크립트 공격(XSS)으로부터 토큰을 안전하게 보호한다.

    ![](https://velog.velcdn.com/images/leekh010502/post/308ae8ae-ca29-41f9-89eb-217165f5229e/image.png)

        ![](https://velog.velcdn.com/images/leekh010502/post/04fbcfd7-48e0-433b-9c53-1b87c050f83e/image.png)
