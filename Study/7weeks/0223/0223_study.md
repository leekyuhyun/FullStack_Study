# 도서 API 업데이트

[👉🏻 지난 시간 진행 과정 확인](https://velog.io/@leekh010502/week6-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Node.js-%EA%B8%B0%EB%B0%98-REST-API-%EA%B5%AC%ED%98%84-6-0213)

## books-category 연관 관계 설정

다음 시간에 카테고리별 도서 조회할 때 0,1,2 값이 아닌 category 테이블에 name (동화,소설,사회)처럼 나오도록 구현하기 위해서 books 테이블을 수정할 필요가 있습니다.

현재 books / category 테이블 모습입니다.
![](https://velog.velcdn.com/images/leekh010502/post/76aaf56a-bb26-44a4-9d5f-c929774a79ed/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/b5a21619-7ee6-466e-bb75-8e9f9c803ac9/image.png)

이 books 테이블의 category_id 컬럼을
category 테이블의 참조하여 사용할 수 있도록 외래키 설정을 해주어야합니다

```sql
ALTER TABLE books ADD INDEX category_id_idx (`category_id` ASC);

ALTER TABLE books ADD CONSTRAINT category_id
FOREIGN KEY (category_id) REFERENCES category (id);
```

우선 `ADD INDEX` 명령어를 사용하여 `category_id` 컬럼에 대한 색인을 생성함으로써 검색 성능을 최적화했습니다.
그리고 나서 category 테이블의 id를 참조하는 books 테이블의 `category_id`를 `외래키(FK)`로 설정했습니다.

## 도서 목록 조회 API 구현

위에 수정된 테이블을 활용해서 개별 도서 조회에 join을 활용하여 category_name도 추가해보겠습니다.

```javascript
export const getBookById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.book_id = ?`;
  conn.query(sql, [id], (err, results) => {
    if (err) {
      console.error("도서 개별 조회 요청 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "존재하지 않는 도서입니다.",
      });
    }
  });
};
```

left Join을 통해서 books 테이블 뒤에 바로 category 테이블의 category 테이블의 name 컬럼이 pub_date 바로 뒤에 배치됩니다.

![](https://velog.velcdn.com/images/leekh010502/post/9aa4cdfa-bb90-45e2-a156-5fccc15b2206/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/fb6b9d0a-f140-40da-b2bd-42ec3b42b4ca/image.png)

## 데이터베이스 시간 범위 구하기

날짜 데이터를 다룰 때는 현재 시간을 기준으로 특정 기간을 더하거나 빼는 함수를 자주 사용합니다.

- 시간 더하기
  `DATE_ADD(기준 날짜, INTERVAL)`

- 시간 빼기
  `DATE_SUB(기준 날짜, INTERVAL)`

- 시간 범위를 설정해서 SELECT
  `SSELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();`

## 카테고리별, 신간, 도서 목록 조회

사용자의 요청(Query String)에 따라 SQL 문을 유연하게 조립하는 동적 쿼리 방식으로 구현하였습니다.

```javascript
export const getAllbooks = (req, res) => {
  let { category_id, news } = req.query;
  let sql = "SELECT * FROM books";
  let values = [];

  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [category_id];
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values = [category_id];
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  conn.query(sql, (err, results) => {
    if (err) {
      console.error("도서 전체 조회 요청 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.OK).json(results);
  });
};
```

- 쿼리문을 수정할 수 있도록 let sql로 선언하고, ?에 매핑될 값을 담을 values 배열을 준비합니다.

- category_id와 news가 모두 있을 때: 두 조건을 AND로 연결합니다.

- 각 조건에 맞는 WHERE 절을 추가합니다.

- conn.query 호출 시 values 배열을 인자로 전달하여 SQL Injection을 방지하고 정확한 데이터를 매핑합니다.

![](https://velog.velcdn.com/images/leekh010502/post/9f61b812-f31d-4b0b-80ec-0def6f8361e1/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/f8280c7e-2dfa-46c1-8992-f950ab7f16d4/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/95472bb5-3cc8-4644-9df6-f3348a473192/image.png)

## 데이터베이스 페이징(paging)

데이터베이스에 저장된 수만, 수백만 개의 데이터를 한 번에 클라이언트로 보내면 서버도 힘들고 브라우저도 느려집니다. 그래서 데이터를 일정한 크기(페이지)로 나누어 필요한 부분만 가져오는 것을 페이징이라고 합니다.

LIMIT: 한 페이지에 몇 개의 데이터를 보여줄 것인가? (페이지 당 데이터 수)

OFFSET: 어디서부터(몇 번째 데이터부터) 시작할 것인가? (건너뛸 데이터 수)

예시 (한 페이지에 4개씩)

- 1페이지
  `SELECT * FROM books LIMIT 4 OFFSET 0;`(1~4번 데이터)

- 2페이지
  `SELECT * FROM books LIMIT 4 OFFSET 4;`(5~8번 데이터)

- 3페이지
  `SELECT * FROM books LIMIT 4 OFFSET 8;`(9~11번 데이터)

## 도서 목록 조회 페이징 구현

기존의 카테고리 필터링, 신간 조회 로직에 LIMIT과 OFFSET을 활용한 페이징 기능을 통합하였습니다.

```javascript
xport const getAllbooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;

  let parsedLimit = parseInt(limit);
  let offset = (parseInt(currentPage) - 1) * parsedLimit;

  let sql = "SELECT * FROM books";
  let values = [parseInt(limit), offset];

  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [category_id, news];
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values = [category_id];
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parsedLimit, offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("도서 전체 조회 요청 DB 에러:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(StatusCodes.OK).json(results);
  });
};
```

1. 데이터 조회 시작점(Offset) 계산

- (현재 페이지 번호 - 1) \* 페이지당 도서 수`
  - 클라이언트로부터 받은 `currentPage`와 `limit`을 활용해 DB에서 **'앞에서 몇 개를 건너뛰고 조회를 시작할지'** 결정하는 `offset` 값을 구합니다.
  - 예를 들어 2페이지를 요청하면, 앞선 1페이지 분량(4개)을 건너뛰고 5번째 데이터부터 가져오게 됩니다.

2. SQL 문법 순서와 동적 쿼리 조립

- SQL 문법상 `LIMIT`과 `OFFSET`은 반드시 쿼리의 **가장 마지막**에 위치해야 합니다.
  1. 기본 `SELECT` 문을 먼저 선언합니다.
  2. 카테고리 필터링이나 신간 여부(`WHERE`) 조건이 있을 경우 이를 먼저 `sql` 문자열에 덧붙입니다.
  3. 모든 조건절이 붙은 후, 마지막에 `LIMIT ? OFFSET ?`를 추가하여 쿼리를 완성합니다.

3. 매개변수(Values) 배열 관리

- `conn.query`에 전달하는 `values` 배열은 SQL 문 내의 `?` 순서와 정확히 일치해야 합니다.
- 필터링 조건에 따라 `category_id` 등을 먼저 배열에 담고, 페이징에 필요한 `limit`과 `offset` 값을 마지막에 `push`하여 쿼리가 안전하게 실행되도록 구현했습니다.

![](https://velog.velcdn.com/images/leekh010502/post/05a8e89c-01b2-49c8-98c6-cf128e3f69ce/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/18068f63-92a9-49db-a4d9-91305672b973/image.png)
