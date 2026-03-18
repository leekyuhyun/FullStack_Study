import React from 'react';
import './App.css';

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
