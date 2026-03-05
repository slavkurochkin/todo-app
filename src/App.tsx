import { useState, KeyboardEvent } from 'react'
import './App.css'

type Filter = 'all' | 'active' | 'completed'

interface Todo {
  id: number
  text: string
  completed: boolean
}

let nextId = 1

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  function addTodo() {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, { id: nextId++, text, completed: false }])
    setInput('')
  }

  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addTodo()
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <h1>Todo</h1>

      <div className="input-row">
        <input
          type="text"
          className="todo-input"
          placeholder="Adds a task"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      {todos.length > 0 && (
        <>
          <div className="filters">
            {(['all', 'active', 'completed'] as Filter[]).map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <ul className="todo-list">
            {filtered.map(todo => (
              <li key={todo.id} className="todo-item">
                <span
                  className={`todo-text ${todo.completed ? 'completed' : ''}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className="footer">
            <span>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
            {completedCount > 0 && (
              <button className="clear-btn" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        </>
      )}

      {todos.length === 0 && (
        <p className="empty">No tasks yet. Add one above.</p>
      )}
    </div>
  )
}
