import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "premium_todo_v3";

const uid = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random()
    .toString(16)
    .slice(2)}`;

const defaultTodos = [
  {
    id: uid(),
    text: "Design landing page hero section",
    completed: false,
    priority: "high",
    category: "Work",
    dueDate: "",
    createdAt: Date.now() - 1000000,
  },
  {
    id: uid(),
    text: "Buy groceries for dinner",
    completed: true,
    priority: "medium",
    category: "Personal",
    dueDate: "",
    createdAt: Date.now() - 500000,
  },
];

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultTodos;
    } catch {
      return defaultTodos;
    }
  });

  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [theme, setTheme] = useState("glow");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const stats = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const active = todos.length - completed;
    const high = todos.filter((t) => t.priority === "high" && !t.completed).length;
    return { total: todos.length, completed, active, high };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    let list = [...todos];

    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "latest") return b.createdAt - a.createdAt;
      if (sortBy === "oldest") return a.createdAt - b.createdAt;
      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "due") {
        const da = a.dueDate || "9999-12-31";
        const db = b.dueDate || "9999-12-31";
        return da.localeCompare(db);
      }
      return 0;
    });

    return list;
  }, [todos, filter, search, sortBy]);

  const addTodo = (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;

    setTodos((prev) => [
      {
        id: uid(),
        text: clean,
        completed: false,
        priority,
        category,
        dueDate,
        createdAt: Date.now(),
      },
      ...prev,
    ]);

    setText("");
    setCategory("General");
    setPriority("medium");
    setDueDate("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id) => {
    const clean = editingText.trim();
    if (!clean) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: clean } : todo))
    );
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const markAll = () => {
    const allDone = todos.every((t) => t.completed);
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allDone })));
  };

  return (
    <div className={`app-shell ${theme}`}>
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />
      <div className="mesh mesh-c" />

      <main className="dashboard">
        <section className="topbar">
          <div>
            <p className="eyebrow">Organize everything in your life</p>
            <h1>Todo Vision</h1>
            <p className="subtitle">
              A comprehensive suite of features
Meet your unique needs
            </p>
          </div>

          <div className="top-actions">
            <button
              type="button"
              className="chip-btn"
              onClick={() => setTheme((prev) => (prev === "glow" ? "soft" : "glow"))}
            >
              {theme === "glow" ? "Switch to Soft Mode" : "Switch to Glow Mode"}
            </button>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card accent-1">
            <span>Total Tasks</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card accent-2">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="stat-card accent-3">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
          <div className="stat-card accent-4">
            <span>High Priority</span>
            <strong>{stats.high}</strong>
          </div>
        </section>

        <section className="composer">
          <form className="todo-form" onSubmit={addTodo}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want to finish today?"
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              Add Task
            </button>
          </form>
        </section>

        <section className="controls">
          <input
            className="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by text, category, priority..."
          />

          <div className="filters">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "filter active" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="sort-row">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="latest">Sort: Latest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="priority">Sort: Priority</option>
              <option value="due">Sort: Due Date</option>
            </select>

            <button type="button" className="ghost-btn" onClick={markAll}>
              {todos.every((t) => t.completed) ? "Uncheck All" : "Check All"}
            </button>

            <button
              type="button"
              className="ghost-btn danger"
              onClick={clearCompleted}
              disabled={stats.completed === 0}
            >
              Clear Completed
            </button>
          </div>
        </section>

        <section className="list-section">
          {visibleTodos.length === 0 ? (
            <div className="empty">
              <h2>No tasks found</h2>
              <p>Try changing the filter or add a new task.</p>
            </div>
          ) : (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "done" : ""}`}
                >
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span />
                  </label>

                  <div className="body">
                    <div className="meta-row">
                      <span className={`badge ${todo.priority}`}>{todo.priority}</span>
                      <span className="badge soft">{todo.category}</span>
                      {todo.dueDate && <span className="date">Due {todo.dueDate}</span>}
                    </div>

                    {editingId === todo.id ? (
                      <div className="edit-block">
                        <input
                          className="edit-input"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button className="mini-btn" type="button" onClick={() => saveEdit(todo.id)}>
                            Save
                          </button>
                          <button
                            className="mini-btn muted"
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditingText("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="task-text">{todo.text}</p>
                    )}
                  </div>

                  <div className="actions">
                    <button type="button" className="mini-btn" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button type="button" className="mini-btn danger" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;