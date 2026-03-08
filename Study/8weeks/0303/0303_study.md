# 주문 API 완성하기

이번 시간엔 주문 API 전부 구현해볼 예정입니다.

## DELETE, TRUNCATE 차이

### DELETE

- 데이터 조작어(DML): 테이블에서 특정 행(Row)을 선택하여 삭제하는 명령어입니다.

- 조건부 삭제: WHERE 절을 사용하여 원하는 데이터만 골라 삭제할 수 있다는 것이 가장 큰 특징입니다.

- 로그 기록 및 속도: 삭제하는 행마다 로그를 남기기 때문에 처리 속도가 상대적으로 느리지만, ROLLBACK을 통해 삭제 전으로 복구가 가능합니다.

- ID 값 유지: 데이터를 지워도 AUTO_INCREMENT로 설정된 기본키 값은 초기화되지 않고 유지됩니다. (예: 10번까지 쓰고 지우면 다음 데이터는 11번부터 시작)

### TRUNCATE

- 데이터 정의어(DDL): 테이블의 구조만 남기고 데이터 전체를 순식간에 비우는 명령어입니다.

- 전체 삭제 전용: WHERE 절을 사용할 수 없으며, 무조건 테이블의 모든 행을 삭제합니다.

- 로그 최소화 및 속도: 개별 행을 삭제하는 로그를 남기지 않고 테이블 공간 자체를 해제하기 때문에 대용량 데이터를 비울 때 속도가 매우 빠릅니다.

- ID 값 초기화: 테이블을 처음 생성했을 때와 같은 상태로 되돌리기 때문에 AUTO_INCREMENT 값이 1번부터 다시 시작됩니다.

- 복구 불가: 실행 즉시 커밋되어 ROLLBACK으로 데이터를 되살릴 수 없으므로 주의해서 사용해야 합니다.

### SET FOREIGN_KEY_CHECKS = 0

외래키 제약 조건 일시 해제

- 역할: MySQL에서 외래키(Foreign Key) 제약 조건을 일시적으로 비활성화하는 명령어입니다.
- 사용 목적: 다른 테이블에서 참조되는 데이터를 DELETE 또는 TRUNCATE할 때, 외래키 제약으로 인한 오류를 방지합니다.

```sql
SET FOREIGN_KEY_CHECKS = 0;  -- 외래키 제약 해제
DELETE FROM orders;          -- 또는 TRUNCATE TABLE orders;
SET FOREIGN_KEY_CHECKS = 1;  -- 외래키 제약 복구
```

## 주문하기 API (비동기 처리 및 장바구니 삭제)

지난 시간에 배운 비동기처리를 활용하여 코드를 수정하고 주문 완료 후 장바구니에 상품을 삭제해볼 예정입니다.
[👉🏻 비동기처리 확인하기](https://velog.io/@leekh010502/week7-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Node.js-%EA%B8%B0%EB%B0%98%EC%9D%98-REST-API-%EA%B5%AC%ED%98%84-11-0227)

```javascript
export const order = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  const promiseConn = conn.promise();

  try {
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await promiseConn.execute(sql, values);
    const delivery_id = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
           VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await promiseConn.execute(sql, values);
    const order_id = results.insertId;

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    const itemValues = items.map((item) => [
      order_id,
      item.book_id,
      item.quantity,
    ]);
    await promiseConn.query(sql, [itemValues]);

    const cartIds = items.map((item) => item.cart_id);
    await deleteCartItems(promiseConn, cartIds);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "주문 완료 및 장바구니가 비워졌습니다.", order_id });
  } catch (err) {
    console.error("주문 처리 중 에러 발생:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};
```

- `export const order = async (req, res)`: async 함수로 선언 → 비동기 작업 처리 가능
- `const promiseConn = conn.promise()`: Promise 기반 데이터베이스 연결 객체 생성
- `req.body`에서 주문 정보(상품, 배송 정보, 수량, 가격 등)를 받습니다
- 1단계: `await promiseConn.execute(sql, values)`- 배송 정보 저장 완료될 때까지 대기 → `delivery_id `획득
- 2단계: a`wait promiseConn.execute(sql, values)` - 주문 정보 저장 완료될 때까지 대기 → `order_id `획득
- 3단계: `await promiseConn.query(sql, [itemValues])` - 상품 일괄 저장 완료될 때까지 대기
- 4단계: `await deleteCartItems(promiseConn, cartIds) `- 장바구니 삭제 완료될 때까지 대기
- 모든 await가 순차적으로 실행 → 데이터 무결성 보장
- 201 Created 상태 코드로 성공 응답 반환
- 모든 단계에서 에러 발생 시 catch 블록에서 500 상태 코드 반환

```javascript
export const deleteCartItems = async (promiseConn, cartIds) => {
  const sql = `DELETE FROM cart WHERE cart_id IN (?)`;
  const [result] = await promiseConn.query(sql, [cartIds]);
  return result;
};
```

- `export const deleteCartItems = async (promiseConn, cartIds)`: async 함수로 선언
- `const sql = DELETE FROM cart WHERE cart_id IN (?)`: 여러 개의 cart_id를 한 번에 삭제하는 SQL 쿼리
- `const [result] = await promiseConn.query(sql, [cartIds])`: await로 삭제 작업 완료될 때까지 대기
- `return result`: 삭제 결과 반환 (몇 개의 행이 삭제되었는지 확인 가능)
- 주문 함수에서 await deleteCartItems(promiseConn, cartIds)로 호출 → 장바구니 삭제가 완료될 때까지 기다렸다가 다음 단계 진행

![](https://velog.velcdn.com/images/leekh010502/post/65e8c027-ce95-4b18-a864-1761697e6434/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/b1de5c53-d2ff-4a7c-84c8-59668c414799/image.png)

## 전체 주문 내역 조회

orders 테이블과 delivery 테이블을 LEFT JOIN으로 연결하여 모든 주문과 배송 정보를 조회합니다. 200 OK 상태 코드로 결과를 반환합니다.

```javascript
export const getOrders = async (req, res) => {
  const promiseConn = conn.promise();

  try {
    const sql = `
      SELECT 
        orders.order_id, 
        orders.book_title, 
        orders.total_quantity, 
        orders.total_price, 
        orders.created_at, 
        delivery.address, 
        delivery.receiver, 
        delivery.contact 
      FROM orders 
      LEFT JOIN delivery ON orders.delivery_id = delivery.delivery_id

    `;

    const [results] = await promiseConn.execute(sql);

    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error("주문 목록 조회 중 에러:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};
```

- `export const getOrders = async (req, res)`: async 함수로 선언
- `const promiseConn = conn.promise()`: Promise 기반 데이터베이스 연결 객체 생성
- `const [results] = await promiseConn.execute(sql)`: await로 SQL 쿼리 완료될 때까지 대기
- `LEFT JOIN`: orders 테이블의 모든 행을 포함하고 delivery 테이블의 일치하는 배송 정보를 함께 조회
- SELECT 절: order_id, book_title, total_quantity, total_price, created_at, address, receiver, contact 정보 조회
- 배송 정보가 없는 주문도 조회 가능 (배송 필드는 NULL)
- 200 OK 상태 코드로 모든 주문 정보를 배열 형태로 반환

![](https://velog.velcdn.com/images/leekh010502/post/04134dcb-fffc-4f41-9607-2c2143943f3f/image.png)

## 주문 상세 조회

특정 주문(order_id)의 orderedBook 테이블과 books 테이블을 LEFT JOIN으로 연결하여 주문한 책의 상세 정보(제목, 저자, 가격, 수량)를 조회합니다. 결과가 없으면 404 Not Found를 반환합니다.

```javascript
export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  const promiseConn = conn.promise();

  try {
    const sql = `
      SELECT 
        ob.book_id, 
        b.title AS book_title, 
        b.author, 
        b.price, 
        ob.quantity 
      FROM orderedBook AS ob
      LEFT JOIN books AS b ON ob.book_id = b.book_id
      WHERE ob.order_id = ?
    `;

    const [results] = await promiseConn.execute(sql, [id]);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "해당 주문의 상세 내역을 찾을 수 없습니다.",
      });
    }

    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error("주문 상세 조회 중 에러:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};
```

- `export const getOrderDetail = async (req, res)`: async 함수로 선언
- `const { id } = req.params`: URL 경로 파라미터에서 order_id를 추출 (예: /orders/5 → id = 5)
- `const promiseConn = conn.promise()`: Promise 기반 데이터베이스 연결 객체 생성
- `const [results] = await promiseConn.execute(sql, [id])`: await로 SQL 쿼리 완료될 때까지 대기
- `LEFT JOIN`: orderedBook 테이블과 books 테이블을 연결하여 주문한 책의 상세 정보 조회
- `WHERE ob.order_id = ?`: 특정 주문에 해당하는 상품들만 필터링
- results.length === 0: 주문이 없으면 404 Not Found 상태 코드 반환
- SELECT 절: book_id, title, author, price, quantity 정보 조회
- 200 OK 상태 코드로 주문의 모든 상품 정보를 배열로 반환

![](https://velog.velcdn.com/images/leekh010502/post/ea348f3f-ba5a-4680-b2a4-f880a5b36f0f/image.png)
