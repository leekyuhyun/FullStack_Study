## 백엔드(Node.js) / 실전 프로젝트
### 백엔드의 구조
- 웹 서버
    - 정적 페이지에 대해 대응
    - 동적 페이지에 대한 처리는 직접 처리하지 않고, 웹 어플리케이션 서버에게 전달
        - 정적 페이지란, 화면의 내영/데이터 등의 변동이 없는 페이지
        
- 웹 어플리케이션 서버와 데이터베이스
    - 동적 페이지를 처리
    - 필요한 데이터 연산을 위해 데이터베이스와 연결되어 있으며 데이터 조회/수정/삭제에 대한 처리를 요청
    	- 동적 페이지란, 데이터 처리/연산을 통해 화면의 내용 데이터가 변하는 페이지
       - 데이터베이스란, 데이터를 통합하여 효율적으로 관리하기 위한 데이터 집합체를 말함
            
  ![](https://velog.velcdn.com/images/leekh010502/post/166cb409-778c-4bf5-8d5f-9b2cd84a7756/image.png)

### **Node.js**
- 자바스크립트를 스크립트 언어 이상으로 프로그래밍 언어 역할을 할 수 있도록 지원하는 플랫폼
- 자바스크립트로 백엔드를 구현할 수 있음

- **Node.js로 간단한 웹 서버 만들기**
```javascript
//server.js
let http = require('http');
let url = require('url');

function start(route, handle){
    function onRequest(request, response){
        let pathname = url.parse(request.url).pathname;
        
        route(pathname, handle, response);
    }
    http.createServer(onRequest).listen(7777);
}

exports.start = start;
```

- **`server.js` : 서버 생성 및 요청 대기**
서버의 물리적인 구동을 담당하는 파일
   - `http.creatServer`
   	- Node.js 내장 모듈을 사용하여 서버를 만들고, 7777번 포트에서 요청을 대기
   - `onRequest` 함수
   	- 브라우저로부터 요청이 들어올 때마다 실행됩니다. 사용자가 접속한 URL에서 pathname을 추출하여 라우터에게 전달

```javascript
//router.js
function route(pathname, handle, response){
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response);
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not Found');
        response.end();
    }
}
exports.route = route;
```

- **`router.js` : 경로에 따른 안내 역할**
사용자가 입력한 주소(pathname)에 따라 어떤 기능을 실행할지 결정하는 이정표 역할
   - `route` 함수
   	- `handle` 객체 안에 해당 주소와 연결된 함수가 있는지 확인
   - 실행 및 예외 처리
   	- 연결된 함수가 있다면 실행하고, 만약 없는 주소라면 브라우저에 404 Not Found 메시지를 보냄

```javascript
//requestHandler.js
function main(response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('leekyuhyun\'s page');
    response.end();
}

function myname(response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('leekyuhyun');
    response.end();
}

let handle = {}; //key:value 형태의 객체
handle['/'] = main;
handle['/leekyuhyun'] = myname;

exports.handle = handle;   
```

- **`requestHandler.js` : 실제 응답 데이터 처리**
사용자의 요청에 대해 구체적으로 어떤 내용을 보여줄지 정의
   - `main` 함수
   	- 루트 주소(/) 접속 시 'leekyuhyun's page'라는 문구를 응답
   - `myname` 함수
   	- `/leekyuhyun` 주소 접속 시 'leekyuhyun'이라는 문구를 응답
   - `handle` 객체
   	- 주소와 실행될 함수를 키(key)와 값(value)의 쌍으로 저장하여 관리

```javascript
//index.js
let server = require('./server');
let router = require('./router');
let requestHandler = require('./requestHandler');

server.start(router.route, requestHandler.handle);
```

- **`index.js` : 프로그램의 시작점**
위의 모든 모듈을 하나로 조립하여 서버를 가동하는 메인 파일
   - 각 파일(`server`, `router`, `requestHandler`)을 `require`를 통해 불러옵니다.
   - `server.start` 함수를 호출할 때, 라우팅 정보와 핸들러 정보를 인자로 넘겨주어 전체 시스템을 실행

사용자가 브라우저에서 주소를 입력하면 `server`가 이를 감지하고, `router`가 주소를 확인한 뒤, `requestHandler`가 해당하는 내용을 그려내어 사용자에게 다시 보여주는 구조

![](https://velog.velcdn.com/images/leekh010502/post/6a267482-6be1-4e09-b9dc-741ffa15a784/image.png)

### HTTP 템플릿
![](https://velog.velcdn.com/images/leekh010502/post/218c9333-dbfd-4af0-9123-9da18aa78ad9/image.png)

- Head
    - 웹 서버의 통신 상태가 어떤지 알려줌
    	- ex)
           - 200 : 정상
           - 404 : 클라이언트가 원하는 걸 못찾음
           - 500 : 서버가 이상함
       - 이 숫자들을 HTTP (status) code라고 부름 
	
    - 응답이 어떤 형태인지 적어점 
    	- ex) HTML
        
 ### 실전 프로젝트
 테니스 라켓 쇼핑몰 만들기
    - 메인 페이지와 주문 목록으로 이루어진 간단한 실습 프로젝트
    
 ![](https://velog.velcdn.com/images/leekh010502/post/979dcabf-8a75-4dbb-983a-015f0293f1a9/image.png)

메인 UI 화면