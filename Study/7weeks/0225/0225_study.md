# 장바구니 API 구현

## cart 테이블 생성

books 테이블의 books_id와 users 테이블의 user_id를 참조하였습니다.

```sql
CREATE TABLE cart (
    cart_id INT NOT NULL AUTO_INCREMENT,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (cart_id),

    INDEX book_id_idx (book_id ASC),
    INDEX user_id_idx (user_id ASC),

    CONSTRAINT fk_cart_book
      FOREIGN KEY (book_id)
      REFERENCES books (book_id)
      ON DELETE CASCADE,

    CONSTRAINT fk_cart_user
      FOREIGN KEY (user_id)
      REFERENCES users (user_id)
      ON DELETE CASCADE
);
```

## route/carts.js

우선 controller 코드 작성 전에 route 코드 작성 먼저 해보았습니다.

```javascript
import express from "express";
import {
  addCart,
  getCartItems,
  deleteCartItem,
} from "../controller/cartController.js";
const router = express.Router();

router
  .post("/", addCart)

  .get("/", getCartItems)

  .delete("/:cart_id", deleteCartItem);

export default router;
```

## 장바구니 담기 API 구현

책, 사용자 아이디와 수량 (quantity)를 body에 담아서 보냈습니다

```javascript
export const addCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  const sql = "INSERT INTO cart (book_id, quantity, user_id) VALUES (?, ?, ?)";
  const values = [book_id, quantity, user_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("장바구니 담기 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};
```

![](https://velog.velcdn.com/images/leekh010502/post/563cfec6-4bde-407b-b315-f75bfd83c13a/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/c3fdd942-1c56-495c-9547-16eb81c60b07/image.png)

## 장바구니 목록 조회 API 구현

`LEFT JOIN`을 통해 `cart` 테이블의 수량 정보와 `books` 테이블의 도서 상세 정보를 한 번에 가져오도록 구현했습니다.

```javascript
export const getCartItems = (req, res) => {
  const { user_id } = req.body;

  let sql = `
    SELECT 
        cart.cart_id, 
        cart.book_id, 
        books.title, 
        books.summary, 
        cart.quantity, 
        books.price 
    FROM cart 
    LEFT JOIN books ON cart.book_id = books.book_id
    WHERE cart.user_id = ?`;

  let values = [user_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("장바구니 조회 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.OK).json(results);
  });
};
```

![](https://velog.velcdn.com/images/leekh010502/post/f9a815e2-220a-47f8-bc08-f7c2fdc7312b/image.png)

## 장바구니에서 선택한 상품 목록 조회 API 구현

`selected` 유무에 따라 SQL을 구성하는 동적 SQL 방식을 적용했습니다. `selected`가 없을 땐 전체 목록을, 있을 땐 `IN` 연산자를 추가해 특정 도서 정보만 필터링하도록 구현했습니다.

```javascript
export const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;

  let sql =
    ...동일;

  let values = [user_id];

  if (selected && selected.length > 0) {
    sql += ` AND cart.cart_id IN (?)`;
    values.push(selected);
  }

  conn.query(sql, values, (err, results) => {
    ... 동일
};
```

![](https://velog.velcdn.com/images/leekh010502/post/cb5bfb03-9bed-420c-8d2c-2a93190a1d7a/image.png)
