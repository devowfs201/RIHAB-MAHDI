import React, { useReducer, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const InitialState = { todos: [] };

const Reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH':
      return { ...state, todos: action.payload };

    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };

    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        ),
      };

    default:
      return state;
  }
};

function TODOLIST() {
  const [state, dispatch] = useReducer(Reducer, InitialState);
  const [newTodo, setNewTodo] = useState('');
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      dispatch({ type: 'FETCH', payload: data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    dispatch({ type: 'ADD_TODO', payload: { id: Date.now(), text: newTodo, completed: false } });
    setNewTodo('');
  };

  const deleteTodo = id => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const toggleTodo = id => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const saveEdit = id => {
    if (editText.trim() === '') return;
    dispatch({ type: 'EDIT_TODO', payload: { id, text: editText } });
    setEditText('');
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">TODOLIST</h1>

      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Add Todo"  value={newTodo} onChange={e => setNewTodo(e.target.value)} />
        <button className="btn btn-primary" onClick={addTodo}>Add</button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>

      ) : (
        <ul className="list-group">
          {state.todos.map(todo => (
            <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center" >
              <div className="d-flex align-items-center">
                <input type="checkbox" className="form-check-input me-2" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />

                <span className={todo.completed ? 'text-decoration-line-through' : ''}>
                  {todo.text}
                </span>
              </div>

              <div>
                {editId === todo.id ? (
                  <>
                    <input type="text" className="form-control d-inline-block w-auto me-2" value={editText} onChange={e => setEditText(e.target.value)} />
                    <button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(todo.id)}>  Save </button>
                  </>

                ) : (
                  <>
                    <button  className="btn btn-warning btn-sm me-2" onClick={() => {
                        setEditId(todo.id);
                        setEditText(todo.text);
                      }}
                    > Edit </button>

                    <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(todo.id)}  > Delete </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TODOLIST;
