# 좋아요 API 구현

## likes DB 구현

우선 좋아요 테이블부터 만들어보겠습니다.

```sql
CREATE TABLE likes (
  user_id INT NOT NULL,
  liked_book_id INT NOT NULL,

  INDEX user_id_idx (`user_id` ASC),
  INDEX liked_book_id_idx (`liked_book_id` ASC),

  CONSTRAINT fk_likes_user
    FOREIGN KEY (`user_id`)
    REFERENCES users (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,

  CONSTRAINT `fk_likes_book`
    FOREIGN KEY (`liked_book_id`)
    REFERENCES books (`book_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
)
```

- `user_id` & `liked_book_id`
  각각 `users` 테이블의 `user_id`와 `books` 테이블의 `book_id`를 참조하도록 설정했습니다.

- 이를 통해 존재하지 않는 사용자가 좋아요를 누르거나, 존재하지 않는 도서에 좋아요가 등록되는 데이터 무결성 오류를 방지합니다.

- `INDEX user_id_idx` & `INDEX liked_book_id_idx`
  두 참조 컬럼에 인덱스를 부여했습니다.

- 특정 사용자가 좋아요를 누른 목록을 조회하거나, 특정 도서의 전체 좋아요 개수를 집계(`COUNT`)할 때 훨씬 빠른 속도로 데이터를 찾아낼 수 있습니다.

- `ON DELETE CASCADE`
  원본 데이터가 삭제될 때의 동작을 정의합니다.

사용자가 서비스에서 탈퇴하거나 도서 정보가 삭제될 경우, 이와 연결된 좋아요 데이터도 자동으로 함께 삭제되도록 설정하여 유령 데이터가 남지 않게 관리합니다.

## 좋아요 API 구현

### route/likes.js

```javascript
router
  .post("/:liked_book_id", addLike)

  .delete("/:liked_book_id", removeLike);
```

### controller/likeController.js

```javascript
export const addLike = (req, res) => {
  const { liked_book_id } = req.params;
  const { user_id } = req.body;

  let sql = "Insert INTO likes (user_id, liked_book_id) VALUES (?, ?)";
  let values = [user_id, liked_book_id];
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

export const removeLike = (req, res) => {
  const { liked_book_id } = req.params;
  const { user_id } = req.body;

  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  const values = [user_id, liked_book_id];

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
```

### 좋아요 추가

![](https://velog.velcdn.com/images/leekh010502/post/66b25104-eaab-4a24-bc82-6f030b94d235/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/3400ac7d-79dc-4eaf-a99a-fa93a09bb312/image.png)

### 좋아요 삭제

![](https://velog.velcdn.com/images/leekh010502/post/dfd177f9-5f12-4f39-b64f-a5bb8baa7104/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/c58019b2-1c41-4a5c-9f13-f5dc3aa4f141/image.png)

## count(), AS, 서브쿼리의 등장

### count()

말 그대로 조건에 맞는 행(Row)의 개수를 반환합니다.

- 특정 도서의 좋아요 총합, 특정 카테고리의 도서 수 등을 구할 때 사용합니다.

- ex) `SELECT count(*) FROM likes WHERE liked_book_id = 1;` (1번 책의 좋아요가 몇 개인지 조회)

### AS (Alias)

함수를 사용하거나 컬럼명을 바꿀 때, 결과 데이터에 새로운 이름을 부여하는 키워드입니다.

`count(*)` 같은 함수를 쓰면 결과 컬럼명이 지저분해지는데, 직관적인 이름으로 바꿔주어 백엔드에서 쉽게 접근할 수 있게 합니다.

ex) `SELECT count(*) AS total_likes FROM likes;` (결과 객체에서 results[0].total_likes로 접근 가능)

### 서브쿼리

메인 쿼리문 안에 포함된 또 다른 SELECT 문을 말합니다.

- 메인 테이블(books)을 한 줄씩 읽을 때마다, 해당 행의 데이터를 가지고 서브쿼리가 실행되어 결과를 가져옵니다.

- "도서 목록을 가져오면서, 각 도서가 받은 좋아요 개수를 계산해서 붙여주고 싶을 때" 사용합니다.

### books API에 적용해보기

도서 테이블(books)에 컬럼을 추가하지 않고, 서브쿼리와 AS를 사용해 데이터를 가져오도록 구현했습니다.

추가로 모든 책 정보를 확인하고 싶을 때를 위해, 페이징 파라미터가 있을 때만 LIMIT 구문이 동작하도록 수정했습니다.

```javascript
// 도서 전체 조회
export const getAllbooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;

  let sql = `SELECT *,
                (SELECT count(*) FROM likes WHERE liked_book_id = books.book_id) AS likes
             FROM books`;
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

  if (limit && currentPage) {
    let parsedLimit = parseInt(limit);
    let offset = (parseInt(currentPage) - 1) * parsedLimit;

    sql += " LIMIT ? OFFSET ?";
    values.push(parsedLimit, offset);
  }

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("도서 조회 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

export const getBookById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT books.*, category.name AS category_name,
                  (SELECT count(*) FROM likes WHERE liked_book_id = books.book_id) AS likes
               FROM books
               LEFT JOIN category ON books.category_id = category.category_id
               WHERE books.book_id = ?`;
  conn.query(sql, [id], (err, results)
             ... 기존과 동일
  });
};
```

![](https://velog.velcdn.com/images/leekh010502/post/a076a718-6b45-4183-b98f-1bf1aba67f46/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/ae8a16bf-414d-4b54-9e51-97e1bffb774c/image.png)
