# DB 설계

### ERD 설계 하면서 API도 부분 수정하였습니다.

## 1. users ERD

| 컬럼명   | 타입    |
| :------- | :------ |
| id       | int     |
| email    | varchar |
| password | varchar |

## 2. books ERD

| 컬럼명      | 타입      |
| :---------- | :-------- |
| id          | int       |
| title       | varchar   |
| category    | varchar   |
| format      | varchar   |
| isbn        | varchar   |
| summary     | text      |
| description | text      |
| author      | varchar   |
| pages       | int       |
| index       | text      |
| price       | int       |
| likes       | int       |
| pubDate     | timestamp |

## 3. likes ERD

| 컬럼명        | 타입 |
| :------------ | :--- |
| user_id       | int  |
| liked_book_id | int  |

## 4. cart_item ERD

| 컬럼명       | 타입 |
| :----------- | :--- |
| cart_id      | int  |
| book_id (FK) | int  |
| count        | int  |

## 5. delivery ERD

| 컬럼명   | 타입    |
| :------- | :------ |
| id       | int     |
| address  | varchar |
| receiver | int     |
| contact  | int     |

## 6. order ERD

| 컬럼명      | 타입      |
| :---------- | :-------- |
| order_id    | int       |
| delivery_id | int       |
| total_price | int       |
| created_at  | Timestamp |
| book_title  | varchar   |
| total_count | int       |

## 7. pay ERD

| 컬럼명   | 타입 |
| :------- | :--- |
| order_id | int  |
| book_id  | int  |
| count    | int  |

[👉🏻 API 설계 확인하기]
(https://velog.io/@leekh010502/week6-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Node.js-%EA%B8%B0%EB%B0%98%EC%9D%98-REST-API-%EA%B5%AC%ED%98%84)
