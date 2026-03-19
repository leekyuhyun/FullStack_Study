import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

// 사용자 정의 타입
type Todo = {
  id: number;
  text: string;
  isChecked: boolean;
};

const TodoList: React.FC = () => {
  const title: string = '오늘 할 일'; // data binding
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '공부하기', isChecked: false },
    { id: 2, text: '잠자기', isChecked: false },
    { id: 3, text: '밥먹기', isChecked: false },
  ]);
  const handleCheckedChange = (itemId: number) => {
    setTodos((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item,
      ),
    );
  };

  const [newTodo, setNewTodo] = useState<string>('');
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, isChecked: false }]);
      setNewTodo('');
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    console.log('remove');
  };

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleTodoClick = (todo: Todo) => {
    // TODO: modal open + show desc
    setShowDetail(true);
    setSelectedTodo(todo);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  return (
    <div className="container">
      <h1>{title}</h1>
      <div id="form">
        <Form.Control
          type="text"
          placeholder="새 할 일 추가"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button variant="primary" onClick={addTodo}>
          추가하기
        </Button>
      </div>
      <div className="board">
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                className="chk"
                type="checkbox"
                onChange={() => handleCheckedChange(todo.id)}
              />
              <span onClick={() => handleTodoClick(todo)}>
                {todo.isChecked ? <del>{todo.text}</del> : <span>{todo.text}</span>}
              </span>
              <button className="removeBtn" onClick={() => removeTodo(todo.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
