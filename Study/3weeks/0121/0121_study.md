## 자바스크립트 네이밍룰 / req.params 연습 / 객체, 배열 비구조화 / map,형변환

### 자바스크립트 네이밍 룰

#### camelCase

- 두 번째 이상의 단어는 첫 글자를 대문자로 사용
- 주요 용도 -> 변수명, 함수명
  - `getElementById`

#### PascalCase

- camelCase에서 첫 번째 단어의 첫 글자도 대문자로 사용
- 주요 용도 -> 클래스(Class), 리액트 컴포넌트명
  - `AboutMe.jsx`

#### snake_case

- \_(언더바)를 이용해 단어를 구분
- 주요 용도 -> DB 필드명, 서버 설정 파일, 상수
  - `user_profile_image`

#### kebab-case

- -(하이픈)을 이용해 단어를 구분
- 주요 용도 -> URL 주소, CSS 클래스명, 파일명
  - `.user-profile-image`

### req.params 연습

#### 유튜브 채널 이름 출력해보기

```javascript
app.get("/:nickname", function (req, res) {
  const parmas = req.params;
  res.json({
    chanel: parmas.nickname,
  });
});
```

/:nickname (Route Parameter)

- 주소창에 직접 입력되는 가변적인 값을 의미
- 앞의 콜론(:)은 **"여기에는 아무 값이나 올 수 있고, 그 값을 nickname이라는 이름으로 저장하겠다"**라는 약속
- 예: localhost:3001/SSGLANDERS라고 치면 nickname은 SSGLANDERS가 됨

req.params

- 라우트 파라미터로 들어온 값들을 담고 있는 객체
- 만약 경로가 /:nickname이면, req.params 안에는 { nickname: "입력값" }이 들어있게 됨

![](https://velog.velcdn.com/images/leekh010502/post/9643e804-9470-4fdd-9e14-0902bd0fdc2a/image.png)

#### 유튜브 영상 주소와 시간 출력해보기

```javascript
app.get("/watch", function (req, res) {
  const { v, t } = req.query;
  console.log(v, t);
  res.json({
    video: v,
    time: t,
  });
});
```

`req.query`

- URL에서 ? 뒤에 오는 키=값 쌍들을 담는 객체

- 여러 개의 데이터를 보낼 때는 &로 구분 (예: ?v=1&t=2)

- 특징: 경로(/:id)와 달리 서버 코드에서 경로를 미리 지정할 필요가 없고, 어떤 값이 들어와도 req.query가 다 받아줌

비구조화 할당 (const { v, t } = req.query)

- 원래는 const v = req.query.v;, const t = req.query.t;라고 써야 하는 것을 한 줄로 줄인 자바스크립트 최신 문법

- 코드의 가독성이 좋아져서 실무에서 매우 많이 사용

![](https://velog.velcdn.com/images/leekh010502/post/0a69c6ba-7159-4a09-9fc8-4a2c3fb1fa34/image.png)

### 객체, 배열 비구조화

```javascript
const array = [1, 2, 3, 4, 5];

const [, num2, num3, , num5] = array;

console.log(num2);
console.log(num3);
console.log(num5);
```

배열 비구조화 할당은 **순서(Index)**를 찾아감

- [ : 첫 번째 요소(1)는 받을 변수가 없어서 무시

- , num2 : 두 번째 요소(2)를 num2 변수에 담음

- , num3 : 세 번째 요소(3)를 num3 변수에 담음

- , : 네 번째 요소(4)는 쉼표만 있으므로 무시

- , num5] : 다섯 번째 요소(5)를 num5 변수에 담음

![](https://velog.velcdn.com/images/leekh010502/post/3af5dbff-caf6-4620-878c-8d46bd9f13e5/image.png)

#### 객체 여러 개 생성 후 테스트

```javascript
let youtuber = {
  user01: {
    channelTitle: "SSG랜더스",
    subscribers: "21.4만명",
    videoNum: "4.2천개",
  },
  user02: {
    channelTitle: "튜브김민교",
    subscribers: "77.6만명",
    videoNum: "1.9천개",
  },
  user03: {
    channelTitle: "두치와뿌꾸",
    subscribers: "88.7만명",
    videoNum: "1.9만개",
  },
};

app.get("/:nickname", (req, res) => {
  const { nickname } = req.params;

  if (nickname == "@SSGLANDERS") {
    res.json({ youtuber: youtuber.user01 });
  } else if (nickname == "@Onepunchk1ng_mk") {
    res.json({ youtuber: youtuber.user02 });
  } else if (nickname == "@두치와뿌꾸") {
    res.json({ youtuber: youtuber.user03 });
  } else {
    res.json({ message: "등록되지 않은 유튜버입니다." });
  }
});
```

데이터 정의 (youtuber 객체)

- user01, user02, user03이라는 키(Key) 안에 각각의 유튜버 정보가 객체 안의 객체(Nested Object) 구조로 들어있습니다.

요청 처리 (app.get)

1. const { nickname } = req.params;: 브라우저 주소창에 친 /값을 nickname이라는 변수에 담음

2. 조건문 (if...else if):

- 입력받은 nickname이 특정 문자열(아이디)과 일치하는지 하나씩 검사
- 일치하면 youtuber 객체에서 해당 데이터를 꺼내서 응답

3. 예외 처리 (else):

- 준비된 데이터에 없는 이름이 들어오면 "등록되지 않은 유튜버"라는 메시지를 보냄

![](https://velog.velcdn.com/images/leekh010502/post/7354984a-e501-4a2d-9b9c-af5929daff68/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/39e973d4-7a7e-44db-aad7-06a051550e36/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/72dc0e9a-e718-41e0-98d3-776cb51c0f23/image.png)

### map, 형변환

```javascript
app.get("/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);
  res.json({
    id: id,
    food: db.get(id),
  });
});

let db = new Map();
db.set(1, "Kimchi");
db.set(2, "Bibimbap");
db.set(3, "Bulgogi");
```

**Map 객체 생성 및 데이터 저장**

- 일반 객체({})와 비슷하지만, Map은 set으로 저장하고 get으로 불러온다는 차이가 있음

- 중요: 여기서 저장된 Key는 문자열 "1"이 아니라 **숫자 1**

**왜 `parseInt(id)`가 반드시 필요한가?**
브라우저 주소창(req.params)을 통해 들어오는 모든 값은 **문자열(String)**

- 만약 localhost:3001/1로 접속하면, 서버는 id = "1" (문자열)로 받음

- 그런데 우리가 db.set(1, ...)으로 저장한 Key는 **숫자 1**

- 자바스크립트의 Map은 데이터 타입을 엄격하게 구분하기 때문에, 문자열 "1"로 찾으면 데이터를 찾지 못하고 undefined를 반환

![](https://velog.velcdn.com/images/leekh010502/post/87dd9f85-293b-4d89-bf96-d47b772bfe55/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/1a615cf0-b025-485a-a261-4ef36e023fc6/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/6ed6ea53-3396-48a4-b21f-659934d12db9/image.png)

#### 오늘 배운 점

**1. Params vs Query: 주소창 데이터 추출**

- **Path Params(`/:id`)**: 게시글 번호처럼 리소스의 **고유한 식별**이 필요할 때 사용(`req.params`)
- **Query String(`?v=`)**: 검색어나 필터링처럼 **추가 옵션**을 보낼 때 사용(`req.query`)

**2. 비구조화 할당**

- **객체({})**: 정해진 **Key(이름)**를 기준으로 데이터를 추출
- **배열([])**: 정해진 **Index(순서)**를 기준으로 데이터를 추출하며, 불필요한 값은 `,`로 건너뛸 수 있음

**3. Map 자료구조와 형변환**

- `Map`은 Key의 **데이터 타입**을 엄격하게 구분
- 주소창으로 들어오는 모든 값은 **문자열**이므로, 숫자로 저장된 데이터를 찾으려면 반드시 `parseInt()`로 형변환을 해줘야 함
