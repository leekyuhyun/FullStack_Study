## 클래스형 컴포넌트

클래스형 컴포넌트는 ES6 클래스 문법을 사용해 만드는 컴포넌트입니다. `React.Component`를 상속받아 정의하며, 반드시 `render()` 메서드를 포함해야 합니다. state와 라이프사이클 메서드를 직접 사용할 수 있다는 장점이 있지만, 코드가 길어지고 복잡해지는 단점이 있습니다. 현재는 함수형 컴포넌트와 훅(Hook)이 도입되면서 잘 사용하지 않는 방식입니다.

```tsx
import { Component } from 'react';

class MyComponent extends Component {
  render() {
    return <h1>안녕하세요!</h1>;
  }
}

export default MyComponent;
```

## 함수형 컴포넌트

함수형 컴포넌트는 함수로 정의하는 컴포넌트입니다. 클래스형에 비해 코드가 간결하고 가독성이 높으며, React 16.8부터 훅(Hook)이 도입되면서 state와 라이프사이클 기능도 모두 사용할 수 있게 되었습니다. 현재 리액트에서 권장하는 컴포넌트 작성 방식입니다.

```tsx
function MyComponent() {
  return <h1>안녕하세요!</h1>;
}

export default MyComponent;
```

## TodoList

### State 사용하기

state는 컴포넌트 내부에서 관리하는 동적인 데이터입니다. state가 변경되면 리액트가 자동으로 해당 컴포넌트를 다시 렌더링합니다. 함수형 컴포넌트에서는 `useState` 훅을 사용해 state를 선언하며, `useState`는 현재 상태값과 상태를 변경하는 setter 함수를 배열로 반환합니다. state는 setter 함수를 통해서만 변경해야 하며, 직접 수정하면 리렌더링이 발생하지 않으니 주의해야 합니다.

```tsx
import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '리액트 공부하기', done: false },
    { id: 2, text: '타입스크립트 복습하기', done: false },
  ]);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### 구조 분해 할당

구조 분해 할당은 배열이나 객체의 값을 간편하게 꺼내 변수에 담는 자바스크립트 문법입니다. 리액트에서는 `useState`의 반환값을 받을 때나 props를 꺼낼 때 자주 사용합니다. 코드가 간결해지고 가독성이 높아져 리액트 개발에서 거의 필수적으로 쓰이는 문법입니다.

```tsx
// 배열 구조 분해: useState 반환값을 받을 때
const [todos, setTodos] = useState<Todo[]>([]);

// 객체 구조 분해: 각 todo 항목의 속성을 꺼낼 때
todos.map(({ id, text, done }) => (
  <li key={id} style={{ textDecoration: done ? 'line-through' : 'none' }}>
    {text}
  </li>
));
```

### 데이터 반복 처리하기

리액트에서 배열 데이터를 화면에 반복 출력할 때는 `map()` 메서드를 사용합니다. `map()`은 배열의 각 요소를 순회하며 JSX를 반환하는 방식으로 동작합니다. 이때 반복되는 각 요소에는 반드시 고유한 `key` prop을 지정해야 합니다. `key`는 리액트가 재조정 과정에서 어떤 요소가 변경됐는지 효율적으로 판단하는 데 사용하기 때문입니다. 보통 데이터의 고유 id값을 `key`로 사용하며, 배열의 인덱스는 데이터가 바뀔 수 있어 권장하지 않습니다.

```tsx
<ul>
  {todos.map(({ id, text, done }) => (
    <li key={id} style={{ textDecoration: done ? 'line-through' : 'none' }}>
      {text}
    </li>
  ))}
</ul>
```

### 체크박스 기능 추가

체크박스를 클릭하면 해당 항목의 `done` 상태를 반전시킵니다. state를 직접 수정하지 않고 `map()`으로 새 배열을 만들어 `setTodos`에 전달하는 것이 핵심입니다.

```tsx
const toggleTodo = (id: number) => {
  setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
};

// JSX
<ul>
  {todos.map(({ id, text, done }) => (
    <li key={id}>
      <input type="checkbox" checked={done} onChange={() => toggleTodo(id)} />
      <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
    </li>
  ))}
</ul>;
```

### 새로운 게시물 추가하기

input의 value를 state로 관리하고, 버튼 클릭 시 새 항목을 todos 배열에 추가합니다. 추가 후에는 input을 빈 문자열로 초기화합니다.

```tsx
const [input, setInput] = useState('');

const addTodo = () => {
  if (!input.trim()) return;
  setTodos([...todos, { id: Date.now(), text: input, done: false }]);
  setInput('');
};

// JSX
<div>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="할 일을 입력하세요"
  />
  <button onClick={addTodo}>추가</button>
</div>;
```

### 시계 추가하기

useState로 현재 시간을 관리하고, useEffect와 setInterval을 조합해 1초마다 시간을 업데이트합니다. 컴포넌트가 언마운트될 때 clearInterval로 인터벌을 정리해야 메모리 누수를 방지할 수 있습니다.

```tsx
import { useState, useEffect } from 'react';

const [time, setTime] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => clearInterval(timer); // 언마운트 시 정리
}, []);

// JSX
<p>{time.toLocaleTimeString()}</p>;
```

### 게시물 삭제하기

```tsx
const deleteTodo = (id: number) => {
  setTodos(todos.filter((todo) => todo.id !== id));
};

// JSX
<ul>
  {todos.map(({ id, text, done }) => (
    <li key={id}>
      <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
      <button onClick={() => deleteTodo(id)}>삭제</button>
    </li>
  ))}
</ul>;
```
