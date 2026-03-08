# 비동기 처리

주문 API는 하나의 요청을 처리하기 위해 `delivery` → `orders` → `orderedBook` 순서로 세 개의 쿼리가 순서대로 실행되어야 합니다.
앞 단계의 `insertId`가 다음 단계에 꼭 필요하기 때문에, **비동기 흐름을 직접 제어**해줘야 합니다.
비동기 처리 방법을 정리해보겠습니다!

## 비동기 처리 방법

비동기 작업의 순서를 제어하는 방법은 크게 세 가지가 있습니다.

- **Callback** : 함수 안에 함수를 넘겨서 순서를 보장하는 방식입니다. 구현은 간단하지만, 중첩이 깊어질수록 이른바 **콜백 헬**에 빠져 가독성이 급격히 떨어집니다. 현재 주문 API가 바로 이 방식으로 작성되어 있습니다.
- **Promise** : 비동기 처리를 위한 전용 객체입니다. `.then()`과 `.catch()`로 성공/실패를 깔끔하게 분리할 수 있습니다.
- **async / await** : Promise를 기반으로 만들어진 문법으로, 비동기 코드를 마치 동기 코드처럼 직관적으로 작성할 수 있습니다. 셋 중 가장 권장되는 방식입니다.

## Promise 객체

Promise는 **비동기 작업의 결과를 담는 객체**입니다.
Promise 객체는 세 가지 상태를 가집니다.

- `pending` : 비동기 작업이 아직 진행 중인 상태
- `fulfilled` : 작업이 성공적으로 완료된 상태
- `rejected` : 작업이 실패한 상태

```javascript
const promise = new Promise((resolve, reject) => {
  // 비동기 작업 수행
});
```

`new Promise()`로 객체를 생성할 때, 인자로 넘기는 함수를 **executor**라고 합니다.
executor는 `resolve`와 `reject` 두 개의 콜백을 인자로 받습니다.

## resolve, reject는 .then()의 매개변수와 연관됩니다!

- **resolve** : 작업이 성공했을 때 호출합니다. 인자로 넘긴 값이 `.then()`의 매개변수로 전달됩니다.
- **reject** : 작업이 실패했을 때 호출합니다. 인자로 넘긴 값이 `.catch()`의 매개변수로 전달됩니다.

즉, `resolve("성공!")`을 호출하면 → `.then((result) => ...)` 에서 `result`가 `"성공!"`이 되는 구조입니다!

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;

    if (success) {
      resolve("성공!");
    } else {
      reject("실패!");
    }
  }, 2000);
});

promise
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

## Promise Chaining

`.then()`은 항상 새로운 Promise를 반환하기 때문에, 여러 개의 `.then()`을 이어붙일 수 있습니다.
이것을 **Promise Chaining**이라고 합니다.

```javascript
promise
  .then((result) => {
    return result + " 2번 작업";
  })
  .then((result) => {
    return result + " 3번 작업";
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
```

콜백 헬처럼 안으로 파고드는 게 아니라 **옆으로 체이닝**되기 때문에 훨씬 읽기 편합니다.
주문 API처럼 `delivery_id` → `order_id` 순서로 값을 넘겨야 하는 경우, Promise Chaining으로 흐름을 깔끔하게 표현할 수 있습니다.

## async / await

### async 넌 누구냐

`async`는 단순히 `await`를 쓰기 위한 키워드가 아닙니다. `async` 함수는 두 가지 기능을 가집니다.

- **기능 1** : 함수 앞에 `async`를 붙이면 반환값이 자동으로 Promise로 감싸집니다. `return "완료"`를 해도 실제로는 `Promise.resolve("완료")`가 반환되는 것과 같습니다.
- **기능 2** : 함수 내부에서 `await` 키워드를 사용할 수 있게 해줍니다.

### async의 두 번째 기능, 그리고 await과의 만남

`await`는 Promise가 완료될 때까지 기다렸다가 결과값을 꺼내줍니다.
덕분에 비동기 코드를 마치 동기 코드처럼 위에서 아래로 쭉 읽히게 작성할 수 있습니다.
단, `await`는 반드시 `async` 함수 안에서만 사용할 수 있습니다!

```javascript
const order = async (req, res) => {
  try {
    // delivery INSERT
    const deliveryResult = await conn.query(deliverySql, deliveryValues);
    const delivery_id = deliveryResult.insertId;

    const orderResult = await conn.query(orderSql, [
      delivery_id,
      ...orderValues,
    ]);
    const order_id = orderResult.insertId;

    await conn.query(orderedBookSql, [itemValues]);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "주문 완료", order_id });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};
```

콜백 중첩 없이 위에서 아래로 쭉 읽히는 게 훨씬 직관적입니다.
에러 처리도 `try / catch` 하나로 한 번에 잡을 수 있어서 관리하기도 편합니다.
