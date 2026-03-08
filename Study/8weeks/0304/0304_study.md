# jwt 활용하기

로그인 하면서 jwt 토큰을 발행했었는데 이제 이것을 활용하는 코드 리펙토링을 진행해보겠습니다.

## 공통 함수 구현

**Authorization 함수**
요청 헤더에서 JWT 토큰을 추출하고 검증하여 사용자 정보를 반환하는 공통 함수입니다.

```javascript
// src/utils/auth.js
import jwt from "jsonwebtoken";

export const Authorization = (req) => {
  let receivedJwt = req.headers["authorization"];

  let decodedJwt = jwt.verify(receivedJwt, process.env.JWT_SECRET_KEY);

  return decodedJwt;
};
```

요청 헤더에서 JWT 토큰을 추출하고 검증하여 사용자 정보를 반환합니다. 먼저 `req.headers["authorization"]`으로 클라이언트가 보낸 Authorization 헤더에서 토큰을 추출합니다. 그 다음 `jwt.verify()`를 사용하여 토큰을 검증합니다. 이 함수는 토큰의 서명이 유효한지, 만료되지 않았는지 확인합니다. `process.env.JWT_SECRET_KEY`는 토큰을 발급할 때 사용한 비밀키로, 이것과 일치해야만 검증이 성공합니다. 검증에 성공하면 토큰에 포함된 페이로드`(예: { id: 5, email: "user@example.com", iat: 1709618400, exp: 1709704800 })`를 반환합니다. 검증에 실패하면 에러가 발생합니다.

**사용 방법**

```
import { Authorization } from "../utils/auth.js";

const auth = Authorization(req);
```

## 좋아요 API

우선 좋아요 API부터 진행해보겠습니다.

Authorization(req)를 호출하여 JWT 토큰에서 현재 사용자의 ID를 추출합니다. 이렇게 하면 누가 어떤 책을 좋아요하고 취소했는지 알 수 있습니다.

### 좋아요 추가

```javascript
export const addLike = (req, res) => {
  const { liked_book_id } = req.params;

  const auth = Authorization(req);

  const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
  const values = [auth.id, liked_book_id];

  conn.query(sql, values, function (err, results) {
    if (err) {
      console.error("좋아요 추가 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.CREATED).json({
      message: "좋아요 성공!",
      result: results,
    });
  });
};
```

![](https://velog.velcdn.com/images/leekh010502/post/4352cbbd-0b69-481c-a007-236025ed2b4f/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/2bde3288-9cca-4382-9396-c84a69701455/image.png)

### 좋아요 취소

```javascript
export const removeLike = (req, res) => {
  const { liked_book_id } = req.params;

  const auth = Authorization(req);

  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  const values = [auth.id, liked_book_id];

  conn.query(sql, values, function (err, results) {
    if (err) {
      console.error("좋아요 삭제 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.CREATED).json({
      message: "좋아요 삭제 성공!",
      result: results,
    });
  });
};
```

![](https://velog.velcdn.com/images/leekh010502/post/e2326b3a-1e9e-452b-ada2-9f545da40c16/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/4ead11e9-3e69-4167-a1da-756d5dfe5750/image.png)

## 장바구니 api

Authorization(req)를 호출하여 JWT 토큰에서 현재 사용자의 ID를 추출하여, 장바구니에 책을 담고, 조회할 수 있습니다.

### 장바구니 담기

```js
export const addCart = (req, res) => {
  const { book_id, quantity } = req.body;

  const auth = Authorization(req);

  const sql = "INSERT INTO cart (book_id, quantity, user_id) VALUES (?, ?, ?)";
  const values = [book_id, quantity, auth.id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("장바구니 담기 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};
```

### 장바구니 조회

```js
export const getCartItems = (req, res) => {
  const { selected } = req.body;

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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.OK).json(results);
  });
};
```

## jwt 에러

JWT 검증 과정에서 여러 종류의 에러가 발생할 수 있습니다. 각 에러를 적절히 처리해야 안정적인 API를 구축할 수 있습니다.

### TokenExpiredError

토큰의 유효 기간이 만료된 경우 발생합니다. 토큰은 올바른 형식이고 서명도 유효하지만, 토큰의 exp(expiration time) 시간을 초과했을 때 발생합니다. 예를 들어 토큰이 1시간 유효기간으로 설정되었는데 1시간 이상 지났을 때 발생합니다. 이 경우 사용자에게 다시 로그인하도록 안내하고 새로운 토큰을 발급받게 해야 합니다.

### JsonWebTokenError

토큰 형식이 올바르지 않거나 서명이 검증되지 않은 경우 발생합니다. 토큰이 변조되었거나 손상되었을 때, 잘못된 SECRET_KEY로 서명되었을 때, 또는 토큰 형식 자체가 유효하지 않을 때 발생합니다. 이 경우 토큰이 신뢰할 수 없으므로 사용자의 로그인 데이터를 삭제하고 다시 로그인하도록 해야 합니다.

### try-catch

모든 JWT 관련 에러를 효과적으로 처리하기 위해 try-catch 블록을 사용합니다. `try` 블록에서 `Authorization(req)`를 호출하고, 토큰 검증 중에 에러가 발생하면 즉시 `catch` 블록으로 이동합니다. `catch `블록에서 에러의 종류를 확인하여 `TokenExpiredError`이면 401 상태코드로, `JsonWebTokenError`이면 401 상태코드로, 그 외 예상하지 못한 에러면 500 상태코드로 응답합니다.

## 적용하기

### auth.js -> handleAuthError 함수 추가

에러 로직을 위하여 함수를 추가했습니다.

```javascript
export const handleAuthError = (error) => {
  if (error.name === "TokenExpiredError") {
    return {
      status: StatusCodes.UNAUTHORIZED,
      message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
      code: "TOKEN_EXPIRED",
    };
  }

  if (error.name === "JsonWebTokenError") {
    return {
      status: StatusCodes.UNAUTHORIZED,
      message: "유효하지 않은 토큰입니다.",
      code: "INVALID_TOKEN",
    };
  }

  return {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "인증 처리 중 오류가 발생했습니다.",
    code: "AUTH_ERROR",
  };
};
```

### try-catch

likeController, cartController에서 구현한 코드들으르 try{ }안으로 감싸고 catch로 auth.js의 handleAuthError를 호출합니다.
적용한 코드를 보여드리겠습니다.

```js
export const addLike = (req, res) => {
  try {
    const { liked_book_id } = req.params;

    const auth = Authorization(req);

    const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
    const values = [auth.id, liked_book_id];

    conn.query(sql, values, function (err, results) {
      if (err) {
        console.error("좋아요 추가 DB 에러:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      }
      return res.status(StatusCodes.CREATED).json({
        message: "좋아요 성공!",
        result: results,
      });
    });
  } catch (error) {
    console.error("좋아요 추가 에러:", error);
    const { status, message, code } = handleAuthError(error);
    return res.status(status).json({ message, code });
  }
};
```

![](https://velog.velcdn.com/images/leekh010502/post/1309b524-2ddc-4929-9fbb-268287c6fc75/image.png)
