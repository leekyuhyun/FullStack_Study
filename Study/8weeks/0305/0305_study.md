# 북 스토어 프로젝트 마무리하기

## 내 장바구니 조회 수정

selected 했을 때와 안했을때의 차이를 구분지었습니다.

- selected 했을 때 : 그 책만 조회
- 안했을 떄 : 사용자가 담은 장바구니 전체 조회

```js
export const getCartItems = (req, res) => {
  try {
    const { selected } = req.body || {};
    const auth = Authorization(req);

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

    let values = [auth.id];

    if (selected && selected.length > 0) {
      sql += ` AND cart.cart_id IN (?)`;
      values.push(selected);
    }

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.error("장바구니 조회 DB 에러:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "장바구니 조회에 실패했습니다.",
          error: err.message,
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "장바구니 조회 성공!",
        data: results,
        count: results.length,
      });
    });
  } catch (error) {
    console.error("장바구니 조회 에러:", error);
    const { status, message, code } = handleAuthError(error);
    return res.status(status).json({ message, code });
  }
};
```

![](https://velog.velcdn.com/images/leekh010502/post/f69d636d-df54-482f-92e3-d08cb49b0a66/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/882d3d1a-1631-41bf-9c41-b5f978e56c10/image.png)

## 주문 API 수정

### order (주문하기)

```js
export const order = async (req, res) => {
  try {
    const promiseConn = conn.promise();
    const auth = Authorization(req);

    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body;

    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await promiseConn.execute(sql, values);
    const delivery_id = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
           VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, auth.id, delivery_id];
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
  } catch (error) {
    console.error("주문 처리 중 에러:", error);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const { status, message, code } = handleAuthError(error);
      return res.status(status).json({ message, code });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "주문 처리 중 에러가 발생했습니다.",
      error: error.message,
    });
  }
};

export const deleteCartItems = async (promiseConn, items) => {
  const sql = `DELETE FROM cart WHERE cart_id IN (?)`;
  const [result] = await promiseConn.query(sql, [items]);
  return result;
};
```

![](https://velog.velcdn.com/images/leekh010502/post/5724ff05-099a-4795-bbd7-037565378cf0/image.png)

### getOrder (주문 내역 조회)

```js
export const getOrders = async (req, res) => {
  try {
    const promiseConn = conn.promise();
    const auth = Authorization(req);

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
      WHERE orders.user_id = ?
    `;

    const [results] = await promiseConn.execute(sql, [auth.id]);

    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error("주문 목록 조회 중 에러:", error);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const { status, message, code } = handleAuthError(error);
      return res.status(status).json({ message, code });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "주문 목록 조회 중 에러가 발생했습니다.",
      error: error.message,
    });
  }
};
```

![](https://velog.velcdn.com/images/leekh010502/post/fdfee7ef-e17c-44e5-a698-4f0c884b9b55/image.png)

### getOrderDetail (주문 상세 조회)

```js
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const auth = Authorization(req);
    const promiseConn = conn.promise();

    const sql = `
      SELECT 
        orderedBook.book_id, 
        books.title AS book_title, 
        books.author, 
        books.price, 
        orderedBook.quantity 
      FROM orderedBook
      LEFT JOIN books ON orderedBook.book_id = books.book_id
      WHERE orderedBook.order_id = ? AND orderedBook.order_id IN (
        SELECT order_id FROM orders WHERE user_id = ?
      )
    `;

    const [results] = await promiseConn.execute(sql, [id, auth.id]);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "해당 주문의 상세 내역을 찾을 수 없습니다.",
      });
    }

    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error("주문 상세 조회 중 에러:", error);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const { status, message, code } = handleAuthError(error);
      return res.status(status).json({ message, code });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "주문 상세 조회 중 에러가 발생했습니다.",
      error: error.message,
    });
  }
};
```

![](https://velog.velcdn.com/images/leekh010502/post/6bd6aada-d5b6-4fc6-a04e-0fe6522cb902/image.png)

## 전체 도서 조회 수정

```js
export const getAllbooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;

  let auth = null;
  try {
    auth = Authorization(req);
  } catch (error) {
    auth = null;
  }

  let sql = `SELECT SQL_CALC_FOUND_ROWS *`;

  if (auth) {
    sql += `, (SELECT count(*) FROM likes WHERE liked_book_id = books.book_id) AS likes`;
  }

  sql += ` FROM books`;
  let values = [];

  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values.push(category_id);
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values.push(category_id);
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  limit = limit || 10;
  currentPage = currentPage || 1;
  let parsedLimit = parseInt(limit);
  let parsedCurrentPage = parseInt(currentPage);
  let offset = (parsedCurrentPage - 1) * parsedLimit;

  sql += " LIMIT ? OFFSET ?";
  values.push(parsedLimit, offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("도서 조회 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }

    conn.query("SELECT FOUND_ROWS() AS total", (err, foundRows) => {
      if (err) {
        console.error("도서 총 개수 조회 DB 에러:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      }

      const totalCount = foundRows[0].total;
      const totalPages = Math.ceil(totalCount / parsedLimit);

      return res.status(StatusCodes.OK).json({
        data: results,
        pagination: {
          currentPage: parsedCurrentPage,
          limit: parsedLimit,
          totalCount,
          totalPages,
        },
      });
    });
  });
};
```
