# 유효성 검사

지금까지는 if (user_id && channel_name)와 같이 조건문을 사용해 일일이 입력값을 검증하였지만 하지만 반복되는 코드가 많아지는 불편함이 있었다.
그래서 이를 해결하기 위해 `express-validator `라이브러리를 도입하여 리팩토링을 진행했다.

express-validator 설치
`npm install express-validator`

채널 생성 API에 적용해보기

```javascript
router.post(
  "/channel",
  [
    body("user_id").notEmpty().isInt().withMessage("userId must be a number"),
    body("channel_name")
      .notEmpty()
      .isString()
      .withMessage("channel_name must be a string"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { channel_name, user_id } = req.body;
    const sql = `INSERT INTO Channels (channel_name, user_id) VALUES (?, ?)`;
    conn.query(sql, [channel_name, user_id], function (err, results) {
      if (err) return res.status(500).json(err);
      res.status(201).json(results);
    });
  },
);
```

1. 기존에는 라우터 핸들러 함수 내부에서 `if`문을 만나야 검증이 시작되었지만, 라우터의 미들웨어 배열 `[]`에서 미리 검증을 마치고, 실제 로직에 진입하기전에 '필터링'을 거치기 때문에 본체 코드가 간결해졌다.

2. `.isInt()`, `.isString()` 등을 통해 데이터 타입까지 사전에 검증한다.

# sql err

```sql
if (err) return res.status(500).json(err);
```

위에 에러는 데이터베이스에서 문제가 생겼다면, 더 이상 진행하지 말고 클라이언트에게 에러를 알린 뒤 종료해라라는 코드다.

이러한 상황에서 에러가 발생한다.

1. 데이터베이스 연결 문제: DB 서버가 점검 중이거나 네트워크 오류로 응답하지 않을 때

2. 제약 조건 위반: 존재하지 않는 user_id를 입력하거나, 중복된 값을 넣으려 할 때 (외래키/유니크 제약 조건 위반)

3. 서버 내부 로직 오류: SQL 문법이 잘못되었거나 테이블 구조가 변경되었을 때

# Validator 미들웨어

코드 리팩토링을 하면서 유효성 검사 시 에러나는 코드들이 중복으로 겹쳐있는것을 확인해서 다음과 같이 함수로 만들어서 분리하였다.

```javascript
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};
```

next()를 사용한 이유는 다음 미들웨어를 실행시키기 위해서이다.

next()를 안 사용하지 않게되면, 만약 에러가 없는데도 서버는 무한 대기상태에 빠지게 된다.

내부에서는 이렇게 호출하면 된다.

```javascript
[
  	....
  	....
    validate,
],
```
