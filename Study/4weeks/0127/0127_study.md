## Handler

### Handler란?

- 안드로이드에서 필수적인 개념으로 알려져있는 용어
  넓은 의미로 쓰이는 단어라, 쓰는 환경에 따라 뜻하는 의미가 조금씩 다름
- 일반적인 큰 의미는, 요청에 의해 호출되는 메소드를 뜻함

- Node.js에서는 콜백함수로 HTTP request가 날아오면 자동으로 호출되는 메소드를 의미한다.
  `app.HTTP METHOD (PATH, HANDLER)`

## find(), 예외처리

### find()

- 자바스크립트 배열에서 내가 원하는 조건에 맞는 딱 하나의 데이터를 찾을 때 사용하는 도구

- 동작 방식
  배열의 첫 번째 칸부터 마지막 칸까지 순서대로 훑습니다. 그러다 조건에 맞는 데이터를 발견하면 즉시 찾기를 멈추고 그 데이터를 반환

- 특징
  단 한 개만 찾음: 조건에 맞는 데이터가 여러 개여도 가장 먼저 발견된 하나만 가져옴
  빈손일 때: 끝까지 뒤졌는데 조건에 맞는 게 하나도 없다면 undefined를 돌려줌

### 예외처리

- 서버에서 **"요청이 실패할 가능성에 대비해 미리 퇴로를 만들어 두는 것"**입니다.

- 웹 서버는 클라이언트(브라우저)와 약속된 **상태 코드(Status Code)**로 소통
- 데이터가 없을 때 그냥 가만히 있으면 클라이언트는 서버가 고장 난 건지, 찾는 중인지 알 수 없음
  - 정상 처리 (200 OK)
    "찾으시는 물건 여기 있습니다." 하고 데이터를 건냄

  - 예외 처리 (404 Not Found)
    "창고를 다 뒤져봤는데 그런 물건은 없습니다."라고 명확하게 딱지를 붙여서 알려주는 것

### 실습

```javascript
const express = require("express");
const app = express();
app.use(express.json());
app.listen(3003, console.log("서버가 3003번 포트에서 실행 중입니다."));

const teams = [
  { id: 1, name: "langers" },
  { id: 2, name: "bears" },
  { id: 3, name: "eagles" },
  { id: 4, name: "twins" },
];

// 1. 전체 팀 조회
app.get("/teams", (req, res) => {
  res.json(teams);
});

// 2. 개별 팀 조회
app.get("/teams/:id", (req, res) => {
  let id = req.params.id;
  var findTeam = teams.find((t) => t.id == id);

  if (findTeam) {
    res.json(findTeam);
  } else {
    res.status(404).send("Not found");
  }
});
```

1. find() 로직
   역할: 배열(teams)을 순회하며 조건(t.id == id)에 맞는 첫 번째 데이터를 추출

결과: 일치하는 팀이 있으면 객체를 반환하고, 없으면 **undefined**를 반환

2. 예외 처리 로직
   성공 (if): findTeam에 값이 담겨 있다면(True 판정), 200 OK 상태와 함께 데이터를 전송

실패 (else): findTeam이 undefined라면(False 판정), 404 Not Found 상태 코드를 명시하여 클라이언트에게 데이터가 없음을 정확히 알림

![](https://velog.velcdn.com/images/leekh010502/post/6c93b5a7-cc1b-4214-a080-776177fe825b/image.png)
