## Postman을 이용하여 get, post 간단 테스트

#### 설치

[포스트맨 다운로드] (https://www.postman.com)

#### Get 테스트

```javascript
app.get("/", (req, res) => {
  res.send("안녕하세요 postman get 테스트 중입니다~");
});
```

![](https://velog.velcdn.com/images/leekh010502/post/fb76020c-010f-4521-bd1a-e53477fc2ddb/image.png)

#### Post request, response

```javascript
app.post("/data", (req, res) => {
  res.send("POST 요청 성공!");
});
```

![](https://velog.velcdn.com/images/leekh010502/post/7db658c0-dc43-4def-ae22-2fde592e9cd7/image.png)

```javascript
app.use(express.json());
app.post("/data", (req, res) => {
  // body에 숨겨져서 들어온 데이터를 화면에 출력
  console.log(req.body.message);
  res.send(req.body.message);
});
```

- key -> `app.use(express.json());`

- Express에서 미들웨어는 요청(req)이 응답(res)으로 변하기 전까지 거쳐가는 중간 처리기

![](https://velog.velcdn.com/images/leekh010502/post/8d3ad568-f611-40b7-8f70-8e46b7648e2f/image.png)

### 유튜버 실습 고도화

#### 유튜버 등록

```javascript
app.use(express.json()); // http 외 모듈인 '미들웨어' : json 설정
app.post("/youtuber", (req, res) => {
  db.set(4, req.body);
  res.send(req.body);
});
```

![](https://velog.velcdn.com/images/leekh010502/post/34e805d4-b15c-40b4-88f2-f34cd6873af3/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/54e162f7-b45e-4fc4-bc71-9a4dca3b4a86/image.png)

#### 고도화

- 위에 같이 등록을 하면 다음 유튜버 정보를 입력하면 덮어씌워져서 사라지는 현상이 발생

```javascript
const db = new Map();
var id = 1;
db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

app.use(express.json()); // http 외 모듈인 '미들웨어' : json 설정
app.post("/youtuber", (req, res) => {
  db.set(id++, req.body);
  res.json({
    message: `${db.get(id - 1).channelTitle}님, 등록되었습니다.`,
    youtuber: req.body,
  });
});
```

- Map 객체에 데이터를 넣을 때 `id++`라는 후위 연산자를 사용하면 '현재 번호로 먼저 저장하고 나서 번호를 1 키우는' 방식으로 작동
- 즉, 1번으로 저장되는 순간 변수 id는 이미 2가 되어 다음 데이터를 기다리게 됨
- POST 요청으로 데이터를 방금 막 등록했을 때는 id 값이 이미 다음 번호로 넘어가 있는 상태이므로, 방금 저장한 그 사람의 이름을 확인해서 응답 메시지로 보여주려면 현재 id에서 1을 뺀 db.get(id - 1)을 해줘야만 정확한 데이터에 접근할 수 있게 됨

![](https://velog.velcdn.com/images/leekh010502/post/6aa820e5-051b-488b-afd8-0ee39f20dc4e/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/460a5bd1-c877-41c8-b87c-657dc2289bb4/image.png)

### 오늘 배운 점

1. POST와 미들웨어
   POST는 데이터를 Body에 숨겨서 보내기 때문에, 이를 읽으려면 app.use(express.json())이라는 **통역사(미들웨어)**가 반드시 상단에 선언되어야 한다.

2. 자동 번호표(id++)
   후위 연산자를 사용하면 '현재 번호로 저장하고 나서 번호를 1 키우기' 때문에, 데이터를 넣을 때마다 ID 값을 일일이 수정할 필요 없이 자동으로 증가한다.

3. 논리적 보정(id - 1)
   저장 직후 id 변수는 이미 다음 숫자로 넘어가 있으므로, 방금 등록한 유튜버의 이름을 응답 메시지로 보여주려면 현재 번호에서 1을 뺀 값을 조회해야한다.
