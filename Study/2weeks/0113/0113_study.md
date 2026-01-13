## 데이터베이스 / 실전 프로젝트 (2)
### 데이터베이스
- **데이터베이스란**
    - 데이터를 통합하여 효율적으로 관리하기 위한 데이터 집합체를 데이터베이스(Database,줄여서 DB)
    - 데이터를 구조화하여 관리함으로써 데이터 중복을 막고, 효율적이고 빠른 데이터 연산을 가능하게 함

- **DBMS**
    - 데이터베이스를 운영하고 관리하기 위한 DBMS(Database Management System)를 통해 데이터베이스를 사용
    
- **SQL (Structed Query Language)**
    - SQL은 데이터베이스에 연산을 요청하기 위해 사용되는 언어로 데이터를 생성, 조회, 수정, 삭제 등과 같은 기능을 수행할 수 있음
    - 대표적인 SQL은 다음과 같음	
        - 데이터 생성 : Create
        - 데이터 삽입 : Insert
        - 데이터 조회 : Select
        - 데이터 수정 : Update
        - 데이터 삭제 : Delete
        
### docker, MySQL 설치
- docker 설치 (윈도우, 맥-인텔, 맥-M?시리즈)
    - https://docs.docker.com
    
    - mac유저라면 Homebrew로도 설치 가능
    	`brew install --cask docker`

- MySQL 설치
    - 사용하는 프로젝트 폴더에 `docker-compose.yml`파일 생성 후 입력

  ```yml
  services:
    mysqldb:
      image: mysql:8.0
      container_name: mysql_server
      restart: always
      ports:
        - "3306:3306"
      environment:
        MYSQL_ROOT_PASSWORD: root
        MYSQL_DATABASE: mysql
        MYSQL_USER: user
        MYSQL_PASSWORD: root
      volumes:
        - ./mysql_data:/var/lib/mysql
  ```
  
    - 포트번호, 비밀번호, DB이름, 유저이름은 자유롭게 설정
    
### SQL 문법
- **Create** ()
    - 데이터베이스 확인	
     ```sql
     show databases;
     ```
    - 데이터베이스 생성
    ```sql
    Create Database 이름;
    ```
    
    - 데이터베이스 사용
    ```sql
    Use 생성한 DB 이름;
    ```
    
    - 테이블 생성
    ```sql
    Create Table 테이블 이름
    (
      컬럼명1 자료형,
      컬럼명2 자료형,
      컬럼명3 자료형,
      ...
    );
    ```

- **Select, Insert** (데이터 조회, 삽입)
    - 테이블 데이터 조회
    ```sql
    Select 컬럼명 From 테이블명;
    //전체 조회 시 컬럼명에 (*) 사용
    ```
    
    - 테이블 데이터 조회
    ```sql
    Insert 컬럼명1, 컬럼명2, .... Into 테이블명 Values(컴럼1, 데이터, 컬럼2, 데이터,...);
    ```
    
   - 테이블 데이터 조회
    ```sql
    Select 컬럼명 From 테이블명 Where 조건;
    ```

- **Update, Delete** (데이터 수정, 삭제)
    - 테이블 데이터 수정
    ```sql
    Update 테이블명 Set 컬럼명 = 수정할 값 Where 조건; 
    //(Where 절을 제외하면 테이블 전체 데이터 삭제 가능)
    ```
    
    - 테이블 데이터 수정
    ```sql
    Delete From 테이블명 Where 조건;
    ```

### Node.js와 DB 연동 (실전 프로젝트)  
1. 핵심 로직 및 함수 설명
- Database Connection (`mysqldb.js`) `mysql2` 드라이버를 사용하여 외부 MySQL 서버와의 연결 통로를 정의

```javascript
const mysqldb = require('mysql2');

const conn = mysqldb.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', // MySQL 사용자 계정
    password: '1234', 
    database: 'db' // 생성한 데이터베이스 이름
});

module.exports = conn;
```

2. 주문 데이터 저장 로직 (`requestHandler.js` - `order`)
- 사용자가 `main.html`에서 특정 상품의 주문 버튼을 클릭하면, 브라우저는 `/order?productId=1`과 같은 경로로 서버에 요청을 보냄
- 서버는 이 요청을 받아 다음과 같은 과정을 거쳐 DB에 데이터를 기록

* **데이터 추출**: `server.js`에서 `url.parse(request.url, true)`를 통해 파싱된 `queryData` 객체에서 사용자가 넘긴 상품 ID(`productId`)를 꺼냄
* **DB 쿼리 실행**: 추출한 ID와 현재 날짜(`new Date()`)를 SQL `INSERT` 문에 삽입하여 `orderlists` 테이블에 저장
* **비동기 처리**: `mysqldb.query` 함수가 실행되는 동안 서버는 멈추지 않고 다음 로직을 처리하여 사용자에게 즉각적인 응답을 보냄

```javascript
function order(response, queryData) {
    let productId = queryData.productId; 
    
    // 데이터베이스에 주문 내역 저장 (비동기 처리)
    mysqldb.query("INSERT INTO orderlists VALUES (" + productId + ", '" + new Date().toLocaleDateString() + "');", function(err, rows) {
        if(err) console.error("DB 저장 에러:", err);
        console.log("저장 결과:", rows);
    });

    response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    response.write('주문이 완료되었습니다! <br> 주문 내역 페이지에서 확인하세요.');
    response.end(); 
}
```

3. 동적 페이지 생성 및 데이터 조회 (`requestHandler.js` - `orderlist`)
- 사용자가 'order list' 페이지에 접속하면, 서버는 데이터베이스에 저장된 모든 주문 내역을 가져와 HTML 표(`<table>`) 형식으로 렌더링

* **전체 내역 조회**: `SELECT * FROM orderlists` 쿼리를 실행하여 DB에 저장된 모든 행(rows) 데이터를 가져옴
* **동적 태그 생성**: 미리 읽어온 `orderlist.html` 뼈대 코드 뒤에, `rows.forEach` 반복문을 사용하여 각 주문 데이터(상품 ID, 주문 날짜)를 `<tr><td>` 태그로 변환해 붙여넣음
* **응답 마무리**: 모든 데이터 전송이 끝난 후 테이블 태그를 닫고(`</table>`), 비동기 콜백 함수 내부에서 `response.end()`를 호출하여 브라우저에 화면을 출력함

```javascript
function orderlist(response) {
    console.log('orderlist');

    response.writeHead(200, {'Content-Type' : 'text/html'});

    // DB에서 모든 주문 내역을 조회합니다.
    mysqldb.query("SELECT * FROM orderlists", function(err, rows) {
        // 1. HTML의 기본 틀(헤더 등)을 먼저 보냅니다.
        response.write(orderlist_view);

        // 2. DB에서 가져온 행 데이터를 반복문을 통해 표의 행(tr)으로 변환합니다.
        rows.forEach(element => {
            response.write("<tr>" 
                        + "<td>"+element.product_id+"</td>"
                        + "<td>"+element.order_date+"</td>"
                        + "</tr>");
        });
        
        // 3. 테이블을 닫고 최종적으로 응답을 종료합니다.
        response.write("</table>");
        response.end();
    })
}
```

- 결과 화면
![](https://velog.velcdn.com/images/leekh010502/post/e2d07898-dc38-418b-b66b-7a326fcb6643/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/2dd1ace3-3f97-426f-98d4-dea102df0194/image.png)

- 자세한 코드는 깃허브에 가시면 볼수있습니다
    - [깃허브 바로가기](https://github.com/leekyuhyun/FullStack_Study/tree/main/Study/2weeks/0113)