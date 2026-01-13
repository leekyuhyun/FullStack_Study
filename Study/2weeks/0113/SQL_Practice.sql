//데이터베이스 조회
show databases;

//데이터베이스 생성
Create Databse kyulee;

//데이터베이스 사용
use kyulee;

//테이블 조회
show tables;

//테이블 생성
CREATE TABLE member (
    id VARCHAR(50),
    name VARCHAR(30),
    password VARCHAR(255)
);

//테이블 데이터 삽입
INSERT INTO member (id, name, password) 
VALUES ('kyulee', '이규현', 'aaaa');

INSERT INTO member (id, name, password) 
VALUES ('coffee_love', '김철수', '12345');

INSERT INTO member (id, name, password) 
VALUES ('dev_spark', '박영희', 'sql_pass!@');

//테이블 데이터 조회
select * from member;
select id, name password from member;

//특정 조건의 데이터 조회
select * from member where id = 'kyulee';

//테이블 데이터 수정
UPDATE member 
SET name = '이몽룡', password = 'password555'
WHERE id = 'coffee_love';

//테이블 데이터 삭제
DELETE FROM member 
WHERE id IN ('dev_spark');