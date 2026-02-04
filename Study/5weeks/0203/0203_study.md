# DB 연동 실습

이번 시간에는 유튜브 (채널 & 회원) API 설계했던것을 DB와 연동하는 실습을 해볼 예정입니다.

## 1. DB에 테이블 생성

### 회원(Users) 테이블

![](https://velog.velcdn.com/images/leekh010502/post/f8328f17-a7de-498a-aec9-fd78660073c8/image.png)

### 채널(Channels) 테이블

![](https://velog.velcdn.com/images/leekh010502/post/2c637cc2-8d64-48fb-b412-c43f718af4c8/image.png)

### 테이블 생성시 주의 사항

**FK 참조 무결성 제약조건**
참조 무결성이란 부모 테이블에 존재하지 않는 값을 자식 테이블이 가질 수 없도록 강제하는 것을 말한다.
Channels 테이블에서 `User` 테이블의 `user_id`를 외래키(`FK`)로 참조하고 있어서 `User` 테이블 생성 후 `Channels` 테이블을 생성해야한다.

## 2. 백엔드와 DB 연동

라이브러리 설치

```bash
npm install mysql2
```

백엔드 <-> DB 코드

```javascript
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "youtube",
});

connection.query("SELECT * FROM Users", function (err, results, fields) {
  console.log(results);
  console.log(fields);
});
```

1. **mysql2 모듈 로드**: Node.js와 MySQL 데이터베이스를 연결해 주는 드라이버 라이브러리를 불러온다.
2. **connection 설정**: `createConnection` 메소드를 통해 DB 접속 정보(호스트, 계정, 비밀번호, 데이터베이스 명)를 정의한다.
3. **connection.query()**: 첫 번째 인자로 전달된 SQL 문(`SELECT * FROM Users`)을 DB 서버에서 실행한다.
4. **Callback 함수**: 쿼리 실행이 완료되면 결과값들을 인자로 받아 실행되는 함수이다.
   - **err**: 쿼리 실행 중 발생한 오류 정보를 담는다.
   - **results**: 실제 DB에서 조회된 데이터(Row)들이 객체 배열 형태로 담긴다.
   - **fields**: 조회된 각 컬럼(Column)의 메타데이터(타입, 이름 등 테이블 구조 정보)를 담는다.

![](https://velog.velcdn.com/images/leekh010502/post/ecaa4fda-e181-4fb1-9573-8b10dd17d3cc/image.png)

## 3. TimeZone 설정

`Users` 테이블에 create_at 추가하여 결과를 다시 확인해보았다.
![](https://velog.velcdn.com/images/leekh010502/post/9073d158-e24f-4fb7-895a-c32fe2f9a644/image.png)

db조회를 해보니 시간이 어색해서 수정해보려고 한다.

1. MySQL 서버 시간 변경
   MySQL 서버 자체의 시계를 한국 시간(KST, UTC+9)으로 바꾸었다.

```sql
SET GLOBAL time_zone = "Asia/Seoul";
```

2. Node.js 날짜 포맷팅
   `mysql2` 라이브러리는 기본적으로 날짜 데이터를 JavaScript의 Date 객체로 변환하려고 한다. 이 과정에서 시차가 다시 계산되어 헷갈릴 수 있는데, 이를 `문자열(String)` 그대로 가져오게 해서 DB에 찍힌 시간 그대로 보이게 만들었다.

```javascript
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "youtube",
  dataStrings: true; // 추가
});
```

![](https://velog.velcdn.com/images/leekh010502/post/9d7b4361-8225-4bc3-a045-fc3ce09cb69c/image.png)

## 4.DB 모듈화

위에서 실습한 파일을 모듈화 시켜서 바깥에서 사용할 수 있도록 만들겠습니다.

```javascript
module.exports = connection;
```

외부에서 다음과 같이 작성하여 사용할 수 있습니다.

```javascript
const conn = require("../5weeks/0203/db-connect");
```

# 회원 API 리팩토링

## 1. 회원 개별 조회 연동

```javascript
// 3. 회원 개별 조회
router.get("/user/:email", (req, res) => {
  const { email } = req.params;
  conn.query(
    `SELECT * FROM Users where email = '${email}'`,
    function (err, results, fields) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "회원 정보가 없습니다.",
        });
      }
    },
  );
});
```

![](https://velog.velcdn.com/images/leekh010502/post/e7308b16-df35-4d7e-a318-1e11af7947e6/image.png)

## 2. 회원가입 연동

```javascript
// 2. 회원가입
router.post("/register", (req, res) => {
  const { email, name, password, phone } = req.body;
  if (email && name && password) {
    conn.query(
      `INSERT INTO Users (email, name, password, phone) values (?, ?, ?, ?)`,
      [email, name, password, phone],
      function (err, results, fields) {
        res.status(201).json(results);
      },
    );
  } else {
    res.status(400).json({
      message: "입력값을 확인해주세요.",
    });
  }
});
```

![](https://velog.velcdn.com/images/leekh010502/post/fbec60d7-d043-4262-9048-39e0244f3f05/image.png)

## 3. 회원 삭제 연동

```javascript
// 4. 회원 개별 탈퇴
router.delete("/user/:email", (req, res) => {
  const { email } = req.params;
  if (email) {
    conn.query(
      `DELETE FROM Users WHERE email = ?`,
      email,
      function (err, results, fields) {
        res.status(200).json(results);
      },
    );
  } else {
    res.status(404).json({
      message: "일치하는 회원 정보가 없습니다.",
    });
  }
});
```

![](https://velog.velcdn.com/images/leekh010502/post/b17f8b57-f624-4f85-811f-671ca859fc37/image.png)

## 4. 로그인 연동

```javascript
// 1. 로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // 필드가 비었는지 확인
  if (!email && !password) {
    return res.status(400).json({
      message: "입력된 정보가 없습니다. 아이디와 비밀번호를 입력해주세요.",
    });
  }

  if (!email) {
    return res.status(400).json({
      message: "아이디를 입력해주세요.",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "비밀번호를 입력해주세요.",
    });
  }

  conn.query(
    `SELECT name FROM Users WHERE email = ? AND password = ?`,
    [email, password],
    function (err, results, fields) {
      res.status(200).json(results);
    },
  );
});
```

![](https://velog.velcdn.com/images/leekh010502/post/ace386ef-9119-48d6-b54f-fa228a78a1b8/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/0ab661df-1336-419d-904d-edbba36ff56f/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/d21b3bc4-a5e1-42cb-a3aa-43e295060bb5/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/63025baf-baa6-4ab1-9d7b-a2b098be1235/image.png)
