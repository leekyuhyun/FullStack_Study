# 주문 API 구현

## 주문 관련 테이블 설계

주문 기능을 구현하기 위해 총 세 개의 테이블을 만들었습니다.

### delivery (배송 정보 테이블)

배송지 주소, 수령인, 연락처를 저장하는 테이블입니다.

```sql
CREATE TABLE delivery (
  delivery_id INT NOT NULL AUTO_INCREMENT,
  address VARCHAR(255) NOT NULL,
  receiver VARCHAR(100) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  PRIMARY KEY (delivery_id)
)
```

### orders (주문 요약 테이블)

주문 전체를 요약하는 테이블입니다.

```sql
CREATE TABLE orders (
  order_id INT NOT NULL AUTO_INCREMENT,
  book_title VARCHAR(255) NOT NULL,
  total_quantity INT NOT NULL,
  total_price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  delivery_id INT NOT NULL,
  PRIMARY KEY (order_id),

  CONSTRAINT fk_orders_users
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_orders_delivery
    FOREIGN KEY (delivery_id)
    REFERENCES delivery (delivery_id)
    ON DELETE CASCADE
)
```

- `book_title` : 주문한 책 중 대표 도서명을 저장합니다. (ex. "어린 왕자 외 2건")
- `total_quantity` & `total_price` : 전체 수량과 총 금액을 저장합니다.
- `user_id` & `delivery_id` : 각각 `users`, `delivery` 테이블을 참조하는 외래키입니다.
- `ON DELETE CASCADE` : 사용자가 탈퇴하거나 배송 정보가 삭제되면, 연결된 주문 데이터도 함께 삭제됩니다.

### orderedBook (주문 상세 테이블)

주문 한 건에 어떤 책이 몇 권 포함되었는지 상세하게 저장하는 테이블입니다.

```sql
CREATE TABLE orderedBook (
  ordered_book_id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (ordered_book_id),

  CONSTRAINT fk_ordered_orders
    FOREIGN KEY (order_id)
    REFERENCES orders (order_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_ordered_books
    FOREIGN KEY (book_id)
    REFERENCES books (book_id)
    ON DELETE CASCADE
)
```

- `orders`와 `books` 테이블을 각각 외래키로 참조합니다.
- `orders`가 주문의 "요약본"이라면, `orderedBook`은 그 주문의 "명세서" 역할을 합니다.

## 주문 API 구현

### controller/orderController.js

주문 API는 세 개의 INSERT가 **순서대로** 실행되어야 합니다.

1. `delivery` 테이블에 배송 정보를 먼저 저장하고
2. 반환된 `delivery_id`로 `orders` 테이블에 주문 요약을 저장하고
3. 반환된 `order_id`로 `orderedBook` 테이블에 주문 상세를 저장합니다.

앞 단계의 `insertId`가 다음 단계에 필요하기 때문에, 콜백을 중첩해서 순서를 보장했습니다.

### delivery 테이블 Insert

```javascript
export const order = (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];

  conn.query(sql, values, (err, results) => {
    if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    const delivery_id = results.insertId;
```

req.body에서 받아온 배송 정보를 `delivery` 테이블에 먼저 INSERT 합니다.
INSERT가 성공하면 `results.insertId`로 방금 생성된 `delivery_id`를 꺼내서 다음 단계에 넘겨줍니다.

### orders 테이블 Insert

```javascript
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
           VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

    conn.query(sql, values, (err, results) => {
      if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      const order_id = results.insertId;
```

앞서 받아온 `delivery_id`를 함께 넣어 주문 요약 정보를 `orders` 테이블에 INSERT 합니다.
마찬가지로 `results.insertId`로 `order_id`를 꺼내서 마지막 단계로 넘겨줍니다.

### orderedBook 테이블 Insert

```javascript
      sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
      const itemValues = items.map((item) => [
        order_id,
        item.book_id,
        item.quantity,
      ]);

      conn.query(sql, [itemValues], (err, results) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        return res
          .status(StatusCodes.CREATED)
          .json({ message: "주문 완료", order_id });
      });
    });
  });
};
```

`orderedBook`은 여러 건의 데이터를 한 번에 INSERT 해야 하기 때문에 `items.map()`으로 2차원 배열을 만들어 `VALUES ?` 문법으로 한 번에 넣어줬습니다.

![](https://velog.velcdn.com/images/leekh010502/post/43784307-f054-4aba-9260-2ac86772927f/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/df771fc2-8ec1-4438-98d9-38dee8f5d4a3/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/298c7094-df93-40e2-9164-e92578f3a251/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/4489aec5-a073-4ebe-983d-0fd874788350/image.png)
