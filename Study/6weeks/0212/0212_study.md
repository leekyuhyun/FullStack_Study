# 로그인/회원가입 API 구현하기

저번시간에 간단하게 모듈화해서 구현해놨던 user.js를 제대로 구현해보려고 합니다.

[👉🏻 지난시간 API 구현 확인하기](https://velog.io/@leekh010502/week6-Node.js-%EA%B8%B0%EB%B0%98%EC%9D%98-REST-API-%EA%B5%AC%ED%98%844-0211)

## 1. 데이터베이스 접속 코드 작성

우선 데이터베이스부터 연결하는 코드를 작성해보겠습니다.

```javascript
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dateStrings: true,
});

conn.connect((err) => {
  if (err) console.error("❌ DB 연결 실패:", err.message);
  else console.log("✅ DB 연결 성공!");
});

module.exports = conn;
```

host, user, password, database같은 정보들은 env파일에 작성하여 불러오게 작성하였습니다.

```txt
# env_sample.txt
# 데이터베이스 설정
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=your_database_name
```

## 2. http-status-codes

코드를 작성하다 보면 200, 404, 500 같은 숫자가 무엇을 의미하는지 바로 떠오르지 않을 때가 있는데,
http-status-codes는 숫자 대신 영어 단어로 상태 코드를 적게 해줘서 코드를 읽기 편하게 만드는 도구입니다.

자주 사용하는 코드들을 정리해보았습니다.

| HTTP 상태 코드 | 라이브러리 상수명 (`StatusCodes`) | 의미 및 사용 상황                                                 |
| :------------- | :-------------------------------- | :---------------------------------------------------------------- |
| **200**        | `OK`                              | **성공**: 데이터 조회, 수정, 삭제가 성공했을 때                   |
| **201**        | `CREATED`                         | **생성됨**: 회원가입, 게시글 등록 등 새로운 데이터 생성 성공 시   |
| **400**        | `BAD_REQUEST`                     | **잘못된 요청**: 필수 파라미터 누락, 유효성 검사 실패 시          |
| **401**        | `UNAUTHORIZED`                    | **인증 필요**: 로그인이 안 되어 있거나 토큰이 유효하지 않을 때    |
| **403**        | `FORBIDDEN`                       | **권한 없음**: 로그인은 했지만 해당 리소스에 접근 권한이 없을 때  |
| **404**        | `NOT_FOUND`                       | **찾을 수 없음**: 요청한 페이지나 DB에 해당 ID의 데이터가 없을 때 |
| **409**        | `CONFLICT`                        | **충돌**: 이미 존재하는 이메일로 가입을 시도하는 등 중복 발생 시  |
| **500**        | `INTERNAL_SERVER_ERROR`           | **서버 에러**: 서버 내부 로직 오류나 DB 연결 오류 발생 시         |

라이브러리 설치

```bash
npm install http-status-codes
```

## Express.js의 라우터-미들웨어-컨트롤러 패턴 구조화

전에 실습에서는 Router 파일에 모든 로직을 다 넣고 진행하였는데 이번에는 분리하여 설계해보았습니다.

각 폴더의 역할을 이렇게 되어있습니다.

- Router
  **경로를 안내하는 이정표 역할**을 합니다.

어떤 URL 요청이 들어왔을 때, 어떤 유효성 검증(body)을 거쳐 어떤 컨트롤러 함수로 보낼지 결정합니다.

- Middleware
  **요청 데이터의 유효성을 사전에 검증하는 문지기 역할**을 합니다.

`express-validator`의 `validationResult`를 사용하여 라우터에서 정의한 규칙을 위반한 데이터가 발견되면 컨트롤러로 넘어가기 전 `400 Bad Request` 응답을 보냅니다.

- Controller
  **실제 비즈니스 로직과 DB 상호작용을 담당하는 실행부 역할**을 합니다.

검증이 완료된 데이터를 바탕으로 SQL 쿼리를 실행(`conn.query`)하고, 그 결과에 따라 적절한 HTTP 상태 코드(`StatusCodes`)를 클라이언트에 반환합니다.

이렇게 분리를 다음과 같은 장점이 있습니다.

- 가독성 향상
  한 파일의 코드 길이가 획기적으로 줄어들어 전체적인 흐름을 파악하기 쉽습니다.

- 유지보수 효율성
  유효성 검사 규칙만 수정하고 싶을 때는 라우터를, DB 로직을 고치고 싶을 때는 컨트롤러만 확인하면 되므로 관리가 용이합니다.

- 재사용성
  동일한 validator 미들웨어를 여러 라우트에서 공유하여 사용할 수 있어 코드 중복이 제거됩니다.

### Middleware

클라이언트가 보낸 데이터가 유효한지 검사하는 **'공통 검증 미들웨어'**입니다.

export 키워드를 사용하여 이 미들웨어를 외부 파일에서도 자유롭게 가져다 쓸 수 있도록 만들었습니다.

```javascript
// midleware/validator.js

import { validationResult } from "express-validator";

export const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};
```

### Controller

모든 검증을 마친 데이터를 전달받아 실제 데이터베이스(MySQL)와 상호작용하고, 그 결과에 따라 클라이언트에게 최종 응답을 보내는 역할을 합니다.

`userController.js` 파일에는 `router/users.js`에 모든 로직이 담길 예정입니다.

```javascript
// controller/userController.js
import conn from "../db/mysql_connect.js";
import { StatusCodes } from "http-status-codes";

export const join = (req, res) => {
  const { email, name, password } = req.body;
  const sql = `INSERT INTO Users (email, name, password) VALUES (?, ?, ?)`;
  const values = [email, name, password];

  conn.query(sql, values, function (err, results) {
    if (err) {
      console.error("회원가입 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    res.status(StatusCodes.CREATED).json({
      message: "회원가입 성공!",
      result: results,
    });
  });
};

export const login = (req, res) => {};
```

### Router에 적용해보기 (회원가입 API 구현)

위에서 만들었던 `validator.js`와 `userController.js` 파일을 가져와서 회원가입 API에 적용해보겠습니다.

```javascript
import express from "express";
import { body } from "express-validator";
import { validator } from "../middleware/validator.js";
import { join } from "../controller/userController.js";

const router = express.Router();

router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요."),
    body("name").notEmpty().isString().withMessage("이름을 확인해주세요."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요."),
  ],
  validator,
  join,
);
```

#### 1. 외부 모듈 호출

- `import { body } from "express-validator"`
  사용자가 입력한 값(email, name 등)이 올바른 형식인지 검사하기 위한 도구를 가져옵니다.

- `import validator from "../middleware/validator"`
  검증 결과 에러가 있는지 확인하여 통과 여부를 결정하는 미들웨어를 가져옵니다.

- `import userHandler from "../controller/userController"`
  검증을 마친 후 실제 DB에 데이터를 저장하는 컨트롤러를 가져옵니다.

#### 2. 실행 순서

- 규칙 선언 (Router)
  `body()`를 이용해 이메일 형식, 필수 입력값 등 데이터 검증 규칙을 정의합니다.

- 데이터 검사 (Middleware)
  `middleware/validator.js`가 실행되어 앞서 정의한 규칙에 따라 에러 유무를 판단합니다. 에러가 있으면 여기서 즉시 400 응답을 보내고 요청을 종료합니다.

- 로직 실행 (Controller)
  검증을 통과한 데이터만 `controller/userController.js`로 전달되어 실제 DB 저장(INSERT) 명령을 수행하고 최종 응답을 보냅니다.

### 비밀번호 암호화 (Hash)

개인 정보와 해킹 방지를 위하여 비밀번호는 암호화 해서 사용합다.
Node.js 내장함수인 `crypto`의 를 `pbkdf2Sync` 함수를 사용해서 강력한 단방향 해시 암호화를 구현할 수 있습니다.

**Salt (소금)**: 같은 비밀번호라도 사용자마다 다른 결과값이 나오도록 추가하는 무작위 데이터입니다. randomBytes를 사용하여 생성합니다.

#### user 테이블 salt 컬럼 추가

```sql
ALTER TABLE users ADD salt VARCHAR(100);
```

#### userController.join() 수정

```javascript
// 맨위에 추가
import crypto from "crypto";

// join()안에 추가 및 수정
// 추가
const salt = crypto.randomBytes(10).toString("base64");

const hashPassword = crypto
  .pbkdf2Sync(password, salt, 10000, 10, "sha512")
  .toString("base64");

// 수정 전
const sql = `INSERT INTO Users (email, name, password) VALUES (?, ?, ?)`;
const values = [email, name, password];

// 수정 후
const sql = `INSERT INTO Users (email, name, password) VALUES (?, ?, ?, ?)`;
const values = [email, name, hashPassword, salt];
```

### 회원가입 결과 확인

![](https://velog.velcdn.com/images/leekh010502/post/ff547cfe-6e05-4ddc-8baf-3e76804d3739/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/e3979f66-c50f-4ed1-8050-d823ae0c3631/image.png)

### 로그인 API 구현

회원가입에 이어서 로그인도 구현해보겠습니다.

#### 1. .env에 jwt token 추가

```text
# env_sample.txt -> .env에 추가하세요!!
#JWT 토근
JWT_SECRET_KEY=your_secret_key
```

#### 2. Controller

```javascript
// jwt 토큰 생성을 위해 임포트 해줍니다.
import jwt from "jsonwebtoken";

// userController.js join()아래에 작성하면 됩니다.
export const login = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM Users WHERE email = ?`;

  conn.query(sql, [email], (err, results) => {
    if (err) {
      console.error("로그인 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }

    const loginUser = results[0];

    if (loginUser) {
      const hashPassword = crypto
        .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
        .toString("base64");

      if (loginUser.password === hashPassword) {
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "3m",
            issuer: "kyuhyun",
          },
        );

        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.status(StatusCodes.OK).json({
          message: `${loginUser.name}님, 환영합니다!`,
        });
      }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "아이디 또는 비밀번호가 틀렸습니다.",
    });
  });
};
```

로그인 로직 요약

- 사용자 조회 (이메일 확인)
  사용자가 보낸 이메일을 기준으로 DB에서 해당 유저 정보를 가져옵니다.

가입된 이메일이 없다면 바로 401(인증 실패) 응답을 보냅니다.

- 비밀번호 검증 (Crypto 활용)
  DB에 저장된 해당 유저의 **salt**를 꺼내와서, 입력받은 비밀번호를 다시 해싱합니다.

이렇게 계산된 결과값(hashPassword)이 DB에 저장된 비밀번호와 일치하는지 확인합니다.

- 증명서 발급 및 전달 (JWT & Cookie)
  검증이 완료되면 유저 정보를 담은 JWT를 생성합니다. (이때 .env의 비밀키 사용)

생성된 토큰을 보안을 위해 httpOnly 옵션이 적용된 쿠키에 담아 클라이언트에 전달합니다.

### 로그인 결과 확인

![](https://velog.velcdn.com/images/leekh010502/post/f0211755-4ef7-491f-b67d-78c77a7a58d6/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/7e8b69af-b1e8-4b6e-889b-295f67bc31b1/image.png)

### 비밀번호 초기화 요청 및 수정

비밀번호 초기화 요청을 할때는 이메일을 입력받아서 해당 유저가 회원인지 확인을 합니다.

해당 유저가 확인되면 새로운 비밀번호를 입력하여 전송하면 기존 Salt를 재사용하지 않고 새로운 Salt를 생성합니다.

현재는 비밀번호를 바꿀 때 이메일과 비밀번호를 입력해서 바꾸지만 추후 프론트엔드를 추가하게 되면
이메일로 본인인증 -> 새로운 비밀번호 입력으로 자연스럽게 이어지도록 개선할 예정입니다.

#### controller

```javascript
// 비밀번호 초기화 요청
export const pwdResetReq = (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM Users WHERE email = ?`;

  conn.query(sql, [email], (err, results) => {
    if (err) {
      console.error("비밀번호 초기화 요청 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }

    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
        message: "비밀번호를 변경할 준비가 되었습니다.",
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "해당 이메일로 가입된 정보가 없습니다.",
      });
    }
  });
};

// 비밀번호 초기화
export const pwdReset = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");

  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = `UPDATE Users SET password = ?, salt = ? WHERE email = ?`;
  const values = [hashPassword, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("비밀번호 변경 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }

    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "비밀번호 변경에 실패했습니다.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  });
};
```

### router (users.js)

```javascript
//.post(/"login") 밑에 추가합니다.
 .post(
    "/reset",
    [body("email").notEmpty().isEmail().withMessage("이메일을 입력해주세요.")],
    validator,
    pwdResetReq,
  )

  .put(
    "/reset",
    [
      body("email").notEmpty().isEmail().withMessage("이메일을 입력해주세요."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("새로운 비밀번호를 입력해주세요."),
    ],
    validator,
    pwdReset,
  );
```

### 결과 화면

![](https://velog.velcdn.com/images/leekh010502/post/4912e378-f694-49c9-98a9-e321762b02b1/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/c2828ab4-92a5-472e-8920-79273f03dffb/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/6d7f60b9-722d-4bd6-8e26-1f4ebd07ca84/image.png)
