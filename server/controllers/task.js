const Task = require("../models/Task.js");
const User = require("../models/User.js");

async function createTask(req, res) {
  try {
    const { title } = req.body;
    const user = req.user;
    const task = new Task({ title, user });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create task", details: error.message });
  }
}

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.find({ user: req.user }).populate("user", "email");
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve tasks", details: error.message });
  }
}

async function getTaskById(req, res) {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user,
    }).populate("user", "email");
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve task", details: error.message });
  }
}

async function updateTaskById(req, res) {
  try {
    const { title, status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, status },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update task", details: error.message });
  }
}

async function deleteTaskById(req, res) {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete task", details: error.message });
  }
}

async function getTasksByUser(req, res) {
  try {
    const userId = req.user;
    const tasks = await Task.find({ user: userId }).populate("user", "email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve tasks for user",
      details: error.message,
    });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksByUser,
};
