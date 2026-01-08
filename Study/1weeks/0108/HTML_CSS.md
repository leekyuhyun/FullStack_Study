# HTML/CSS 핵심 문법 정리

## 1. HTML (HyperText Markup Language)
HTML은 웹 페이지의 구조를 정의

### 기본 문서 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>문서 제목</title>
</head>
<body>
    </body>
</html>
```

### 주요 태그 요약
- 제목: <h1>부터 <h6>까지 사용하며 숫자가 작을수록 큼
- 단락: <p> 태그로 문단을 나눕니다.
- 이미지: `<img src="이미지경로" alt="설명텍스트">` (닫는 태그 없음)
- 링크: `<a href="주소">클릭할 글자</a>`
- 구역: <div>는 의미 없는 분할, <header>, <main>, <footer> 등은 의미 있는 분할에 사용
- 목록: <ul>은 순서 없는 목록, <ol>은 순서 있는 목록이며 내부에 <li>를 사용

---

## 2. CSS (Cascading Style Sheets)
CSS는 HTML 요소의 디자인을 담당

### 기본 구문
```css
선택자 {
    속성: 값;
}
```

### 선택자 종류
- 전체 선택자: * { } 모든 요소에 적용
- 태그 선택자: div { } 특정 태그에 모두 적용
- 클래스 선택자: .className { } HTML에서 class="className"인 요소에 적용
- 아이디 선택자: #idName { } HTML에서 id="idName"인 고유한 요소에 적용

### 박스 모델 (Box Model)

1. Content: 실제 내용 (텍스트나 이미지)
2. Padding: 테두리와 내용 사이의 안쪽 여백
3. Border: 테두리 선
4. Margin: 다른 요소와의 바깥쪽 여백

### 주요 속성들
- 너비와 높이: width, height
- 폰트: font-size(크기), font-family(글꼴), font-weight(굵기)
- 색상: color(글자색), background-color(배경색)
- 정렬: text-align: center(글자 중앙 정렬)

---

## 3. 레이아웃 배치 (Flexbox)
요소를 가로 또는 세로로 정렬할 때 사용하는 가장 강력한 도구

```css
.parent {
    display: flex; /* Flexbox 활성화 */
    flex-direction: row; /* 정렬 방향 (row: 가로, column: 세로) */
    justify-content: center; /* 가로(메인축) 정렬 */
    align-items: center; /* 세로(교차축) 정렬 */
    gap: 20px; /* 아이템 사이 간격 */
}
```

---

## 4. 적용 방법
- 외부 스타일: <link rel="stylesheet" href="style.css"> 태그를 <head> 안에 삽입 (가장 권장)
- 내부 스타일: <head> 안에 <style> 태그를 만들어 작성
- 인라인 스타일: 태그 내에 style="..." 속성으로 직접 작성