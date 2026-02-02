# DB 테이블 실습

저번 시간에 만들었던 게시글과 사용자 테이블을 직접 데이터베이스에 만들도록 하겠습니다.
![](https://velog.velcdn.com/images/leekh010502/post/392d486c-92d4-4080-9e01-ddd50d539c5a/image.png)

게시글 테이블에는 사용자 번호가 필요하기 때문에 사용자 테이블부터 만듭니다.

## 1. 데이터베이스 접속하기

```bash
// 1. mysql 컨테이너에 접속하기
docker exec -it [MySQL 컨테이너 ID] bash

// 2. 컨테이너에서 mysql 접속하기
mysql -u [user_name] -p '[user_pwd]'

// 3. 사용할 데이터베이스로 들어가기
// 저는 study 데이터베이스를 만들고 사용했습니다.
user [database_name]
```

## 2. 테이블 생성하기

### 사용자 테이블 생성하기

```sql
-- 유저 테이블 생성--
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    job VARCHAR(50),
    birth Date
);
```

### 게시글 테이블 생성하기

```sql
-- 게사글 테이블 생성--
CREATE TABLE Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE NOW(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
```

## 3. 테이블 안에 값 넣기

### 사용자 테이블에 값 넣기

```sql
INSERT INTO User (user_name, job, birth) VALUES
('kyulee', '학생', '2001-05-02'),
('tester2', '건물주', '1980-04-11'),
('tester3', '유튜버', '2000-04-22'),
('tester4', '배우', '2002-11-12');
```

### 게시글 테이블에 값 넣기

```sql
INSERT INTO Post (title, content, created_at, updated_at, user_id) VALUES
('check1', 'test', '2026-01-21', '2026-01-23', 1),
('wowwow', 'test22', '2026-01-22', '2026-01-23', 2),
('zzz', 'tzzz', '2025-12-30', '2026-01-23', 3),
('wow', 'ohoh', '2025-01-12', '2026-01-23', 1),
('woew', 't333333', '2026-01-22', NULL, 2),
('w4w', 't4444', '2026-01-22', NULL, 4);
```

## 4. 테이블 확인하기

```sql
select * from User;
select * from Post;
```

![](https://velog.velcdn.com/images/leekh010502/post/0c848602-440b-4191-988c-f280c84e060d/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/aaffbe3d-dbcc-480d-9991-630daa562c3c/image.png)

## 5. 핵심 키워드로 알아보는 DB 설계의 원리

위 SQL 코드에는 데이터베이스의 무결성과 자동화를 관리하는 핵심 개념 4가지가 포함되어 있다. 각 키워드의 역할은 다음과 같다.

### 1. PK (Primary Key, 기본키)

- **역할**
  테이블 내의 각 행(Row)을 유일하게 식별할 수 있는 **'신분증'** 번호다.
- **특징**
  값이 중복될 수 없으며(`Unique`), 빈 값(`NULL`)도 허용하지 않는다.
- **코드**
  `user_id INT ... PRIMARY KEY`

### 2. FK (Foreign Key, 외래키)

- **역할**
  한 테이블이 다른 테이블과 관계를 맺도록 연결하는 **'고리'**다.
- **특징**
  `Post` 테이블의 `user_id`는 반드시 `User` 테이블에 존재하는 값이어야 한다. 이를 통해 데이터 간의 관계를 맺고 무결성을 유지한다.
- **코드**
  `FOREIGN KEY (user_id) REFERENCES User(user_id)`

### 3. AUTO_INCREMENT

- **역할**
  새 데이터가 삽입될 때마다 번호를 **자동으로 1씩 증가**시켜 주는 기능이다.
- **특징**
  직접 ID 값을 계산해서 넣을 필요가 없어 관리가 매우 편리하다.
- **코드**
  `post_id INT AUTO_INCREMENT`

### 4. TIMESTAMP & ON UPDATE NOW()

- **역할**: 데이터의 **'생성 시점'**과 **'수정 시점'**을 사람의 개입 없이 자동으로 기록한다.
- **동작 원리**:
  - `DEFAULT NOW()`: 행이 처음 생성될 때(INSERT) 현재 시간을 자동으로 입력한다.
  - `ON UPDATE NOW()`: 데이터 내용이 변경될 때(UPDATE) `updated_at` 컬럼을 현재 시간으로 자동 갱신한다.
- **코드**: `updated_at TIMESTAMP DEFAULT NULL ON UPDATE NOW()`

---

> **데이터 생성 순서의 중요성**
> `Post` 테이블은 `User` 테이블의 `user_id`를 참조하고 있다. 따라서 부모가 되는 `User` 테이블을 먼저 생성하고 데이터를 넣어야만 외래 키 제약 조건에 걸리지 않고 정상적으로 작동한다.

## 6. JOIN: 나누어진 테이블 하나로 합치기

데이터베이스를 설계할 때 데이터를 주제별로 나누어 저장하는 것이 효율적이지만, 데이터를 조회할 때는 이를 다시 합쳐서 봐야 할 때가 많다. 이때 사용하는 명령어가 바로 **JOIN**이다.

### 1. JOIN의 기본 문법

두 테이블을 연결할 때는 서로 공통으로 가지고 있는 컬럼(주로 PK와 FK)을 기준으로 삼는다.

```sql
SELECT
    테이블별명1.컬럼명,
    테이블별명2.컬럼명
FROM 테이블명1 AS 테이블별명1
JOIN 테이블명2 AS 테이블별명2 ON 테이블별명1.공통컬럼 = 테이블별명2.공통컬럼;
```

### 2. 게시글과 작성자 정보 합치기

`Post` 테이블에는 작성자의 상세 정보 대신 식별 번호인 `user_id`만 저장되어 있다. 이때 `JOIN`을 사용하면 `User` 테이블과 번호를 대조하여 작성자의 이름과 직업을 한 번에 가져올 수 있다.

````sql
SELECT * FROM 테이블A LEFT JOIN 테이블B ON 테이블A.공통컬럼 = 테이블B.공통컬럼;

```sql
select * from Post left join User on Post.user_id = User.user_id;
````

![](https://velog.velcdn.com/images/leekh010502/post/614b8b7d-d436-42db-8122-3d69cdfbe107/image.png)
