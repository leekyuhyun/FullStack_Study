# API 설계

저번 시간 화면 별 주요 기능을 토대로 API를 설계 해볼 예정입니다.
[👉🏻화면소개 및 주요 기능 확인하기](https://velog.io/@leekh010502/week5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Node.js-%EA%B8%B0%EB%B0%98%EC%9D%98-Rest-API-%EA%B5%AC%ED%98%841-0206)

## 1. 회원 API

### 1. 회원가입

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/join</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 201</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{
  "email" : "사용자가 입력한 이메일",
  "password" : "사용자가 입력한 비밀번호"
}</code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

### 2. 로그인

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/login</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{
  "email" : "사용자가 입력한 이메일",
  "password" : "사용자가 입력한 비밀번호"
}</code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        JWT_TOKEN
      </td>
    </tr>
  </tbody>
</table>

### 3. 비밀번호 초기화 요청

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 25%;">Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/reset</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{
  "email" : "사용자가 입력한 이메일"
}</code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

### 4. 비밀번호 초기화 (=수정)

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>PUT</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/reset</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{
  "email" : "사용자가 입력한 이메일",
  "password" : "사용자가 입력한 새로운 비밀번호"
}</code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

## 도서 API

### 1. 전체 도서 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/books</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>[
  {
    "id": "도서 id",
    "title": "도서 제목",
    "summary": "요약 설명",
    "author": "도서 작가",
    "price": "가격",
    "likes": "좋아요 수",
    "pubDate": "출간일"
  },
  {
    "id": "도서 id",
    "title": "도서 제목",
    "summary": "요약 설명",
    "author": "도서 작가",
    "price": "가격",
    "likes": "좋아요 수",
    "pubDate": "출간일"
  }
]</code></pre>
      </td>
    </tr>
  </tbody>
</table>

### 2. 개별 도서 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/books/{bookid}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>{
  "id": "도서 id",
  "title": "도서 제목",
  "category": "카테고리",
  "format": "포맷",
  "isbn": "isbn",
  "summary": "요약 설명",
  "description": "상세 설명",
  "author": "도서 작가",
  "pages": "쪽 수",
  "index": "목차",
  "price": "가격",
  "likes": "좋아요 수",
  "liked": true,
  "pubDate": "출간일"
}</code></pre>
      </td>
    </tr>
  </tbody>
</table>

### 3. 카테고리별 도서 목록 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/books?category_id={category_id}&new={boolean}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>[
  {
    "id": "도서 id",
    "title": "도서 제목",
    "summary": "요약 설명",
    "author": "도서 작가",
    "price": "가격",
    "likes": "좋아요 수",
    "pubDate": "출간일"
  },
  {
    "id": "도서 id",
    "title": "도서 제목",
    "summary": "요약 설명",
    "author": "도서 작가",
    "price": "가격",
    "likes": "좋아요 수",
    "pubDate": "출간일"
  }
]</code></pre>
      </td>
    </tr>
  </tbody>
</table>

## 좋아요 API

### 1. 좋아요 추가

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/likes/{bookId}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

### 2. 좋아요 취소

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>DELETE</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/likes/{bookId}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

## 장바구니 API

### 1. 장바구니 담기

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/cart</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 201</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{
  "bookId" : "도서 id",
  "count" : "수량"
}</code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

### 2. 장바구니 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/cart</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>[
  {
    "cartItemId": "장바구니 도서 id",
    "bookId": "도서 id",
    "title": "도서 제목",
    "summary": "도서 요약",
    "count": "수량",
    "price": "가격"
  },
  {
    "cartItemId": "장바구니 도서 id",
    "bookId": "도서 id",
    "title": "도서 제목",
    "summary": "도서 요약",
    "count": "수량",
    "price": "가격"
  }
]</code></pre>
      </td>
    </tr>
  </tbody>
</table>

### 3. 장바구니 도서 삭제

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>DELETE</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/cart/{bookid}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

---

#### 02/10 수정 및 추가

### 4. 장바구니에서 선택한 주문 예상 상품 목록 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/cart</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{ cart_item_id,  cart_item_id, ...}</code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>
  {
    "cartItemId": "장바구니 도서 id",
    "bookId": "도서 id",
    "title": "도서 제목",
    "summary": "도서 요약",
    "count": "수량",
    "price": "가격"
  },
  {
    "cartItemId": "장바구니 도서 id",
    "bookId": "도서 id",
    "title": "도서 제목",
    "summary": "도서 요약",
    "count": "수량",
    "price": "가격"
  }
]</code></pre>
      </td>
    </tr>
  </tbody>
</table>

## 주문 API

### 1. 주문하기

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/orders</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>
        <pre><code>{
    items : [ {
         bookId : 도서 Id,
         count : 수량
     }
      {
         bookId : 도서 Id,
         count : 수량
     }
     ],
    delivery : {
        adress : “주소”,
        receiver : “이름”,
        contact : “010-xxxx-xxxx”
    }
    totalPrice : 총 금액
}
       </code></pre>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>x</td>
    </tr>
  </tbody>
</table>

### 2. 주문 목록(내역) 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/orders</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>[
    {
          created_at : ‘주문일자’,
          delivery : {
                  address : ‘주소’,
                  receiver : ‘이름’,
                  contact : ‘전화번호’
           }
           bookTitle: “대표 책 제목”,
           totalPrice : 결제 금액,
           totalCount : 총 수량
     }
]
        </code></pre>
      </td>
    </tr>
  </tbody>
</table>

### 3. 주문 상세 조회

<table>
  <tbody>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold; width: 30%;">Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">URI</td>
      <td>/orders/{order_id}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">HTTP status code</td>
      <td>성공 200</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Request Body</td>
      <td>x</td>
    </tr>
    <tr>
      <td style="background-color: #f1f1f1; font-weight: bold;">Response Body</td>
      <td>
        <pre><code>[
    {
         bookId : 도서 Id,
         bookTitle : ‘도서 제목’,
         author : ‘작가명’,
         price : 가격,
         count : 수량
     }
    {
         bookId : 도서 Id,
         bookTitle : ‘도서 제목’,
         author : ‘작가명’,
         price : 가격,
         count : 수량
     }
    …..
]
        </code></pre>
      </td>
    </tr>
  </tbody>
</table>
