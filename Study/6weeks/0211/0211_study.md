# 프로젝트 세팅 + app.js 구현

[👉🏻API 설계 확인하기](https://velog.io/@leekh010502/week6-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Node.js-%EA%B8%B0%EB%B0%98%EC%9D%98-REST-API-%EA%B5%AC%ED%98%84)
[👉🏻DB 설계 확인하기](https://velog.io/@leekh010502/week6-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Node.js-%EA%B8%B0%EB%B0%98%EC%9D%98-REST-API-%EA%B5%AC%ED%98%84-3-0210)

## 1. 프로젝트 폴더 생성

book-store 이름으로 프로젝트를 생성하겠습니다.

## 2. 패키지 설치 및 설정

```bash
npm install express express-validator dotenv jsonwebtoken mysql2 nodemon
```

개발 효율성을 위해 nodemon 라이브러리를 설치하였습니다.

### .gitignore

github에 올라갈때 올라가지 말아야할 파일 및 폴더를 설정해주었습니다.

```text
node_modules
.env
```

## 3. 모듈화

API 설계를 바탕으로 우선 간단하게 모듈화부터 해보겠습니다.

### 4-1. users.js

```javascript
import express from "express";

const router = express.Router();

router
  .post("/join", (req, res) => {
    res.json("회원가입");
  })

  .post("/login", (req, res) => {
    res.json("로그인");
  })

  .post("/reset", (req, res) => {
    res.json("비밀번호 초기화 요청");
  })

  .put("/reset", (req, res) => {
    res.json("비밀번호 초기화");
  });

export default router;
```

### 4-2. books.js

```javascript
import express from "express";

const router = express.Router();

router
  .get("/", (req, res) => {
    res.json("전체 도서 조회");
  })

  .get("/:id", (req, res) => {
    res.json("개별 도서 조회");
  });

  .get("/", (req, res) => {
    req.query.category_id;
    res.json("카테고리별 도서 목록 조회");
  });

export default router;
```

### 4-3. likes.js

```javascript
import express from "express";

const router = express.Router();

router
  .post("/:id", (req, res) => {
    res.json("좋아요 추가");
  })

  .delete("/:id", (req, res) => {
    res.json("좋아요 삭제");
  });

export default router;
```

### 4-4. carts.js

```javascript
import express from "express";

const router = express.Router();

router
  .post("/", (req, res) => {
    res.json("장바구니 담기");
  })
  .get("/", (req, res) => {
    res.json("장바구니 조회");
  })

  .delete("/:id", (req, res) => {
    res.json("장바구니 도서 삭제");
  });
/*
  .get("/", (req, res) => {
    res.json("장바구니에서 선택한 주문 예상 상품 목록 조회");
  });
*/
export default router;
```

### 4-5. orders.js

```javascript
import express from "express";

const router = express.Router();

router
  .post("/", (req, res) => {
    res.json("주문하기");
  })
  .get("/", (req, res) => {
    res.json("주문 목록 조회");
  })
  .get("/:id", (req, res) => {
    res.json("주문 상세 상품 조회");
  });

export default router;
```

## 5. app.js 구현

라우터 모듈을 불러오고 미들웨어 등록을 하였습니다.

```javascript
import express from "express";
import dotenv from "dotenv";

import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import likeRouter from "./routes/likes.js";
import cartRouter from "./routes/carts.js";
import orderRouter from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버가 실행중입니다.`);
});
```

## 6. users 테이블 생성하기

```sql
-- 유저 테이블 생성--
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  name VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
);
```
