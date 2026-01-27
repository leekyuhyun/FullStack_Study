## forEach

- `forEach()`는 배열의 각 요소에 대해 제공된 함수를 한 번씩 실행하는 메서드
- 반복문(`for`)의 현대적이고 읽기 쉬운 대안으로 많이 쓰임

기본 문법

```javascript
배열.forEach((요소, 인덱스, 배열자체) => {
  // 실행할 코드
});

// 요소 (Element) : 현재 처리 중인 배열의 항목
// 인덱스 (Index) : (선택) 현재 항목의 번호 (0부터 시작)
// 배열자체 (Array) : (선택) forEach()를 호출한 배열 그 자체
```

실습

```javascript
const arr = [1, 2, 3, 4, 5];

arr.forEach(function (a, b, c) {
  console.log(`a : ${a}, b : ${b} c : ${c}`);
});
```

실행 결과

![](https://velog.velcdn.com/images/leekh010502/post/ab414c40-f8d2-4438-8401-00f6fb08831d/image.png)

### Map에서의 forEach

- `Map` 객체의 `forEach`는 배열의 `forEach`와 유사하지만, **키-값 쌍(Key-Value Pair)**을 다룬다는 점에서 차이가 있음

- `Map` 객체는 요소의 **삽입 순서**를 기억하며, `forEach` 메서드는 이 순서대로 각 요소를 순회

- 콜백 함수의 3가지 인자 (중요!)
  자바스크립트 엔진은 `forEach`를 실행할 때 다음 세 가지 인자를 순서대로 전달 1. **Value (값):** 현재 요소의 실제 데이터 2. **Key (키):** 해당 값에 연결된 이름표(키) 3. **Map (전체):** 현재 순회 중인 `Map` 객체 자체

실습

```javascript
// 1. Map 객체 생성 및 데이터 삽입
let map = new Map();

map.set(1, "one"); // Key: 1, Value: "one"
map.set(3, "three"); // Key: 3, Value: "three"
map.set(2, "two"); // Key: 2, Value: "two"

// 2. forEach를 이용한 순회
map.forEach(function (value, key, source) {
  console.log(`값 : ${value}, 키 : ${key}, 전체 객체 : ${source}`);
});
```

![](https://velog.velcdn.com/images/leekh010502/post/0a79915d-da58-42ea-b3de-a7000b0b68fa/image.png)

## forEach vs map 차이점

1. **forEach**
   - 목적: 각 요소에 대해 특정 작업 수행 (출력, 저장 등)
   - 반환값: 언제나 `undefined`
   - 특징: "그냥 한 바퀴 돌아!" (단순 반복)

2. **map**
   - 목적: 요소를 변환하여 새로운 배열 생성
   - 반환값: 가공된 값이 담긴 **새 배열**
   - 특징: "바꿔서 가져와!" (데이터 변형)

실습

```javascript
const arr = [1, 2, 3, 4, 5];

console.log(`arr = [${arr}]`);

const foreachArr = arr.forEach(function (a, b, c) {
  return a * 2;
});

const mapArr = arr.map(function (a, b, c) {
  return a * 2;
});

console.log(`foreach로 return하면 ${foreachArr},
                 map으로 return하면 ${mapArr}`);
```

![](https://velog.velcdn.com/images/leekh010502/post/e4db139c-f1fd-4b51-a5fc-5465922b8f38/image.png)

## Http 상태 코드

HTTP 상태 코드는 세 자리 숫자로 이루어져 있으며, 첫 번째 숫자가 응답의 **카테고리**를 결정

### 1xx (Informational) : 요청을 받았으며 프로세스가 계속됨

- **101 Switching Protocols**: 클라이언트가 요청한 프로토콜로 전환함을 알림 (예: HTTP에서 WebSocket으로 전환).

### 2xx (Success) : 요청을 성공적으로 처리함

- **200 OK**: 요청이 성공적으로 처리됨. (가장 많이 사용)
- **201 Created**: 요청이 성공적이었으며, 그 결과로 새로운 리소스가 생성됨. (주로 `POST` 요청 결과)
- **204 No Content**: 요청은 성공했으나, 응답 본문에 보낼 데이터가 없음. (예: 삭제 성공)

### 3xx (Redirection) : 요청을 완료하기 위해 추가 작업이 필요함

- **301 Moved Permanently**: 요청한 자원의 URL이 영구적으로 변경됨. (검색 엔진 최적화 시 중요)
- **302 Found / Temporary Redirect**: 일시적으로 URL이 변경됨.
- **304 Not Modified**: 캐시를 목적으로 사용하며, 자원이 수정되지 않았으므로 로컬의 캐시를 사용하라고 알림.

### 4xx (Client Error) : 클라이언트의 요청에 오류가 있음

- **400 Bad Request**: 요청 구문이 잘못되었거나 파라미터가 누락됨.
- **401 Unauthorized**: 인증이 필요함 (로그인이 필요한 페이지).
- **403 Forbidden**: 권한은 없지만 접근은 금지됨 (관리자 전용 페이지 등).
- **404 Not Found**: 요청한 리소스를 서버에서 찾을 수 없음. (주소를 틀린 경우)

---

### 5xx (Server Error) : 서버가 유효한 요청을 처리하지 못함

- **500 Internal Server Error**: 서버 내부의 예기치 않은 오류 발생. (코드 버그 등)
- **502 Bad Gateway**: 게이트웨이나 프록시 서버에 오류가 발생함.
- **503 Service Unavailable**: 서버가 과부하되었거나 점검 중이라 요청을 처리할 수 없음.
- **504 Gateway Timeout**: 서버가 응답을 기다리다 시간을 초과함.

## 유튜버 실습 (Put, Delete)

### 초기 유튜버 등록

![](https://velog.velcdn.com/images/leekh010502/post/70a889dd-5e29-418b-a668-2625009a2341/image.png)

### Put 메서드로 정보 수정

```javascript
app.put("/youtubers/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const youtuber = db.get(targetId);

  if (youtuber) {
    const oldTitle = youtuber.channelTitle;
    const newTitle = req.body.channelTitle;

    db.set(targetId, req.body);
    res.json({
      message: `${oldTitle}님의 정보가 ${newTitle}로 수정되었습니다.`,
    });
  } else {
    res.status(404).json({ message: "수정할 유튜버가 없습니다." });
  }
});
```

![](https://velog.velcdn.com/images/leekh010502/post/556bd99a-e0c6-4423-9244-1f22f5edeb2f/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/98227854-9f24-4761-bf96-30c68e29cc57/image.png)

### Delete로 삭제 (개인)

```javascript
app.delete("/youtubers/:id", (req, res) => {
  const targetId = parseInt(req.params.id);
  const youtuber = db.get(targetId);

  if (youtuber) {
    db.delete(targetId);
    res.json({ message: `${youtuber.channelTitle}님이 삭제되었습니다.` });
  } else {
    res.status(404).json({ message: "삭제할 유튜버가 없습니다." });
  }
});
```

![](https://velog.velcdn.com/images/leekh010502/post/82cd071c-8c00-41d9-b19f-ba47bc4915a7/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/e283aed4-f834-476b-9ab6-ea193b17648f/image.png)

### Delete로 삭제 (전체)

```javascript
app.delete("/youtubers", (req, res) => {
  if (db.size > 0) {
    db.clear();
    res.json({
      message: "전체 유튜버 정보가 성공적으로 삭제되었습니다.",
    });
  } else {
    res.status(404).json({
      message: "삭제할 유튜버 정보가 이미 없습니다.",
    });
  }
});
```

![](https://velog.velcdn.com/images/leekh010502/post/9b27aee8-cba4-4fcd-833b-359a12d0991a/image.png)

## 오늘 배운 점

### 1. 배열과 Map의 순회 (`forEach`, `map`)

- **`forEach()`**: 단순 반복용 메서드. `return` 값이 없으므로 변수에 할당하면 항상 `undefined`가 담김
- **`map()`**: 데이터 변형용 메서드. 콜백 함수가 반환(`return`)하는 값들을 모아 **새로운 배열**을 생성
- **`Map` 객체의 `forEach`**: 인자 순서가 **(값, 키, 전체 객체)** 순서입니다. 배열과 달리 **Value(값)**가 첫 번째 인자로 오는 점에 주의해야 함

### 2. HTTP 상태 코드 (숫자의 의미)

서버가 응답할 때 상태 코드를 통해 처리 결과를 명확히 전달

- **200 (OK)**: 요청이 성공적으로 처리됨.
- **201 (Created)**: 요청이 성공하여 새로운 리소스가 생성됨 (주로 `POST`).
- **400 (Bad Request)**: 클라이언트가 잘못된 요청을 보냄.
- **404 (Not Found)**: 요청한 리소스를 서버에서 찾을 수 없음.
- **500 (Internal Server Error)**: 서버 내부 로직 오류 발생.

### 3. Put, Delete

- **PUT (수정)**:
  - `db.set(id, data)`를 사용.
  - `Map`의 `set`은 동일한 키가 있으면 기존 데이터를 덮어쓰는 성질을 이용
- **DELETE (삭제)**:
  - `db.delete(id)`: 특정 ID를 가진 데이터만 삭제
  - `db.clear()`: `Map` 안의 모든 데이터를 한 번에 삭제(전체 삭제)
