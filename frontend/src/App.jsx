import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = "";

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Add task
  const addTask = async () => {
    try {
      await axios.post("http://localhost:5000/api/tasks", {
        title,
        description,
        category,
        deadline,
      });

      setTitle("");
      setDescription("");
      setCategory("");
      setDeadline("");

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔴 DELETE
  const deleteTask = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🟡 UPDATE STATUS
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>TaskFlow</h1>
        <p>A simple full-stack task management application</p>
      </div>

      <div className="form-card">
        <h2>Add Task</h2>

        <div className="form-grid">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button className="add-btn" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>

      <h2 className="tasks-title">Tasks</h2>

      {tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Add your first task!</div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p className="task-meta">Category: {task.category}</p>
            <p className="task-meta">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>

            <div className="task-actions">
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;