# 리액트

## 리액트(React)란?

리액트는 프레임워크가 아닌, 웹과 네이티브 인터페이스를 만들기 위한 UI 라이브러리입니다. 메타(구 페이스북)에서 개발했습니다.
리액트가 프레임워크가 아닌 라이브러리로 분류되는 이유는 다음과 같습니다.

- 내장 기능이 제한적이며, 라우팅·상태관리 등은 서드 파티 패키지에 의존합니다.
- 완전한 생태계나 고정된 디자인 시스템을 강제하지 않아 프로젝트 구조가 매우 다양합니다.
- 개발자가 프로젝트에 맞는 도구를 자유롭게 선택할 수 있습니다.

## 싱글 페이지 어플리케이션 (SPA)

SPA(Single Page Application)는 페이지 전체를 새로고침하지 않고, 필요한 데이터만 비동기로 받아와 변경된 부분만 동적으로 렌더링하는 방식입니다.

기존 MPA(Multi Page Application)는 페이지를 이동할 때마다 서버에서 HTML 전체를 새로 받아왔습니다. SPA는 최초 한 번만 HTML을 받고 이후에는 필요한 데이터만 주고받기 때문에 화면 전환이 빠르고 사용자 경험이 부드럽습니다.

## 리액트의 동작 원리

리액트는 가상 DOM(Virtual DOM) 을 활용해 화면을 효율적으로 업데이트합니다.

- 초기 렌더링: 앱이 처음 실행되면 가상 DOM을 생성하고 실제 DOM에 반영해 첫 화면을 그립니다.

- 가상 DOM 변경: state나 props에 변화가 생기면 실제 DOM이 아닌 가상 DOM을 먼저 변경합니다.

- 재조정(Reconciliation): 변경 전후의 가상 DOM을 비교해 실제로 달라진 부분만 찾아냅니다.

- 실제 DOM 업데이트: 달라진 부분만 실제 DOM에 반영합니다. 이 덕분에 매번 전체 화면을 다시 그리지 않아도 되어 성능이 향상됩니다.

## 프로젝트 생성

터미널에서 아래 명령어로 리액트 프로젝트를 생성할 수 있습니다.

```bash
# JavaScript 기반 프로젝트
npx create-react-app 프로젝트명

# TypeScript 기반 프로젝트 (권장)
npx create-react-app 프로젝트명 --template typescript
```

프로젝트가 생성되면 아래 명령어로 개발 서버를 실행합니다.

```bash
cd 프로젝트명
npm start
```

주요 폴더 구조는 다음과 같습니다.

```
프로젝트명/
├── public/          # 정적 파일 (index.html 등)
├── src/             # 실제 작업 폴더
│   ├── App.tsx      # 루트 컴포넌트
│   └── index.tsx    # 진입점
├── tsconfig.json    # TypeScript 설정
└── package.json
```

## JSX(TSX) 문법

JSX는 자바스크립트 안에서 HTML과 유사한 문법을 사용할 수 있게 해주는 확장 문법입니다. 타입스크립트 환경에서는 .tsx 확장자를 사용합니다.

```tsx
export default function App() {
  const username = 'kyulee';
  const isLoggedIn = true;
  const inlineStyle = {
    fontSize: '32px',
    color: 'white',
    backgroundColor: 'royalblue', // CSS 속성명은 camelCase로 작성합니다.
  };

  return (
    // JSX는 항상 하나의 부모 태그로 감싸야 합니다. (<> </> 빈 태그 사용 가능)
    <>
      {/* JSX 내부 주석은 이렇게 작성합니다. */}

      <h1>React + TypeScript</h1>

      {/* 중괄호 {}로 JS 변수나 표현식을 사용합니다. */}
      <p>안녕하세요, {username}님!</p>

      {/* 삼항 연산자로 조건부 렌더링이 가능합니다. */}
      {isLoggedIn ? <p>로그인 상태입니다.</p> : <p>로그인이 필요합니다.</p>}

      {/* HTML의 class 속성은 className으로 사용합니다. */}
      <div className="container">내용</div>

      {/* 인라인 스타일은 객체 형태로 전달합니다. */}
      <div style={inlineStyle}>스타일 적용</div>

      {/* 내용이 없는 태그도 반드시 닫는 태그가 필요합니다. */}
      <br />
      <input type="text" />
    </>
  );
}
```
