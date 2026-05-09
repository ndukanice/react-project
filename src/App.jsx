import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'react-todo-list.todos'

const defaultTodos = [
  {
    id: crypto.randomUUID(),
    title: 'Learn how state updates rerender the UI',
    completed: true,
  },
  {
    id: crypto.randomUUID(),
    title: 'Add a second todo item for the screenshot',
    completed: false,
  },
]

export default function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = window.localStorage.getItem(STORAGE_KEY)
    return savedTodos ? JSON.parse(savedTodos) : defaultTodos
  })
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  )

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = newTodo.trim()
    if (!trimmedTitle) return

    setTodos((currentTodos) => [
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        completed: false,
      },
      ...currentTodos,
    ])
    setNewTodo('')
  }

  function toggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  return (
    <main className="app-shell">
      <section className="todo-card">
        <div className="todo-header">
          <p className="eyebrow">React practice project</p>
          <h1>Todo List</h1>
          <p className="subtitle">
            Track a few tasks, toggle them complete, and keep the list in local storage.
          </p>
        </div>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            aria-label="New todo"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a new todo"
            type="text"
          />
          <button type="submit">Add Todo</button>
        </form>

        <div className="todo-meta">
          <span>{todos.length} total</span>
          <span>{completedCount} completed</span>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
              <label className="todo-label">
                <input
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  type="checkbox"
                />
                <span>{todo.title}</span>
              </label>
              <button aria-label={`Delete ${todo.title}`} onClick={() => deleteTodo(todo.id)} type="button">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
