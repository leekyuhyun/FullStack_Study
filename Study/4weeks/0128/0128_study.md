## 로그인 API 구현

API 설계

- requset : body (id,pwd)
- response : ${name}님 반갑습니다.
- http status
  - success (아이디, 비밀번호 일치) -> (200)
  - fail (아이디 혹은 비밀번호 불일치) -> (400)

코드 구현

```javascript
app.post("/login", (req, res) => {
  const { user_id, pwd } = req.body;
  let loginUser = null;

  db.forEach((user) => {
    if (user.user_id === user_id) {
      loginUser = user;
    }
  });
  if (loginUser) {
    if (loginUser.pwd == pwd) {
      res.status(200).json({
        message: `${loginUser.name}님 반갑습니다.`,
      });
    } else {
      res.status(400).json({
        message: "비밀번호를 다시 확인해보세요.",
      });
    }
  } else {
    res.status(400).json({
      message: "아이디를 다시 확인해보세요.",
    });
  }
});
```

![](https://velog.velcdn.com/images/leekh010502/post/a51baa37-4af6-4899-bcf5-5eaee67e4bf9/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/ef1c4518-77a2-476e-87c6-62f441fd9ff6/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/d27b5783-eb1c-4cfb-ba4c-5ddd6feba065/image.png)

## 빈 객체 확인 방법

- 객체를 비교할 때 가장 먼저 이해해야 할 개념 -> 메모리 주소
  - 값 비교
    숫자나 문자열은 값 자체가 같으면 true
  - 참조 비교
    객체는 생성될 때마다 메모리의 새로운 공간(주소)에 저장
  - 결론
    req.body == {}라고 쓰면, 기존에 있던 body 객체와 방금 새로 만든 빈 객체 {}의 주소를 비교.
    두 객체는 주소가 다르기 때문에 내부가 비어있어도 항상 false가 반환

### Object.keys()

- 주소가 아닌 '내용물'을 확인하기 위해 `Object.keys()`를 사용
- 데이터 타입에 따라 결과가 달라지는 점을 주의
  - 문자열 (String)
    자바스크립트는 문자열을 글자들의 나열로 봄, 따라서 각 글자의 순서(인덱스)를 '키(Key)'로 취급합니다. 글자가 있다면 키가 있는 것이므로 false(안 비어있음)가 나옴
  - 숫자 (Number)
    숫자는 객체로 변환되어도 내부를 쪼갤 수 있는 키가 없음, 따라서 값이 1이든 100이든 키의 개수는 0이 되어 true(비어있음)가 나옴
  - 객체 (Object)
    중괄호 안의 실제 속성 개수를 반환

- 예제 코드

```javascript
const obj1 = {};
const obj2 = { message: "안 빔" };

const str = "1";
const num = 1;

const str1 = "one";
const str2 = "";

console.log(Object.keys(obj1).length === 0); // true (빈 객체)
console.log(Object.keys(obj2).length === 0); // false (데이터 있음)

console.log(Object.keys(str).length === 0); // false : 문자열은 객체이다.
console.log(Object.keys(num).length === 0); // true  : 숫자는 객체가 아니다.

console.log(Object.keys(str1).length === 0); // false
console.log(Object.keys(str2).length === 0); // true

console.log(isEmpty(str1)); // str1은 "one"이므로 인덱스(0, 1, 2)라는 키가 존재함 -> 비어있지 않음(false)
console.log(isEmpty(str2)); // str2는 ""이므로 뽑아낼 키가 없음 -> 비어있음(true)으로 간주

function isEmpty(obj) {
  if (Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
}
```

## 로그인 API 고도화 - Object.keys()

- 전체 필드가 빈 경우, 아이디 필드가 빈 경우, 비밀번호 필드가 빈 경우에 대하여 Object.keys()를 활용하여 고도화

- isEmpty() 함수 추가

```javascript
// 1.1 Object.keys() 사용을 위해 isEmpty 함수 추가
function isEmpty(obj) {
  // 객체 안에 이름표(Key)가 하나도 없으면 true(비어있음)를 반환
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}
```

- 빈 필드 확인

```javascript
// 필드가 비었는지 확인
if (isEmpty(req.body)) {
  return res.status(400).json({
    message: "입력된 정보가 없습니다. 아이디와 비밀번호를 입력해주세요.",
  });
}

if (!user_id) {
  return res.status(400).json({
    message: "아이디를 입력해주세요.",
  });
}

if (!pwd) {
  return res.status(400).json({
    message: "비밀번호를 입력해주세요.",
  });
}
```

![](https://velog.velcdn.com/images/leekh010502/post/29f33bd7-0a28-4919-a4a2-8f42ac98c451/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/e86c771c-e54a-4727-949e-00130dad5bf3/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/397c2c02-14f9-4f1f-accc-57391c16c0a5/image.png)

### 로그인 API 전체 코드

```javascript
// 1. 로그인
app.post("/login", (req, res) => {
  const { user_id, pwd } = req.body;

  // 필드가 비었는지 확인
  if (isEmpty(req.body)) {
    return res.status(400).json({
      message: "입력된 정보가 없습니다. 아이디와 비밀번호를 입력해주세요.",
    });
  }

  if (!user_id) {
    return res.status(400).json({
      message: "아이디를 입력해주세요.",
    });
  }

  if (!pwd) {
    return res.status(400).json({
      message: "비밀번호를 입력해주세요.",
    });
  }

  // 아이디, 비밀번호가 일치한지 확인
  let loginUser = null;

  db.forEach((user) => {
    if (user.user_id === user_id) {
      loginUser = user;
    }
  });
  if (loginUser) {
    if (loginUser.pwd == pwd) {
      res.status(200).json({
        message: `${loginUser.name}님 반갑습니다.`,
      });
    } else {
      res.status(400).json({
        message: "비밀번호를 다시 확인해보세요.",
      });
    }
  } else {
    res.status(400).json({
      message: "아이디를 다시 확인해보세요.",
    });
  }
});

// 1.1 Object.keys() 사용을 위해 isEmpty 함수 추가
function isEmpty(obj) {
  // 객체 안에 이름표(Key)가 하나도 없으면 true(비어있음)를 반환
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}
```
