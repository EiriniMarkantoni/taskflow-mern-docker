// ============================
// IMPORTS
// ============================

// Express framework (backend server)
const express = require("express");

// MongoDB μέσω mongoose
const mongoose = require("mongoose");

// CORS (για να μπορεί frontend να καλεί backend)
const cors = require("cors");

// Environment variables (.env)
require("dotenv").config();

// Φέρνουμε το Task model
const Task = require("./models/Task");

// ============================
// INITIALIZATION
// ============================

const app = express();

// Middleware
app.use(cors()); // επιτρέπει requests από frontend
app.use(express.json()); // διαβάζει JSON body

// Port server
const PORT = process.env.PORT || 5000;

// MongoDB connection string
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/taskflow_db";

// ============================
// DATABASE CONNECTION
// ============================

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => console.error("❌ MongoDB error:", error));

// ============================
// ROUTES
// ============================

// Test route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

// ----------------------------
// GET ALL TASKS
// ----------------------------
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ----------------------------
// CREATE TASK
// ----------------------------
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, category, priority, status, deadline } =
      req.body;

    // validation
    if (!title || !description || !category || !deadline) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newTask = new Task({
      title,
      description,
      category,
      priority,
      status,
      deadline,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// ----------------------------
// UPDATE TASK
// ----------------------------
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// ----------------------------
// DELETE TASK
// ----------------------------
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

// ============================
// START SERVER
// ============================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});