import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  PlusCircle,
  Loader2,
  Trash2,
  Edit,
  ListChecks,
} from "lucide-react";
import * as api from "../api/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getAllTasks();
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.createTask({ title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError(null);
    try {
      await api.deleteTaskById(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task.");
    }
  };

  // Handle task completion toggle
  const handleToggleComplete = async (taskId, completed) => {
    setError(null);
    try {
      await api.updateTaskById(taskId, { completed });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, completed } : task
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task.");
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditedTaskTitle(task.title);
  };

  const handleFinishEdit = async (taskId) => {
    if (!editedTaskTitle.trim()) return setEditingTaskId(null);
    setError(null);
    try {
      await api.updateTaskById(taskId, { title: editedTaskTitle });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, title: editedTaskTitle } : task
        )
      );
      setEditingTaskId(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Loading Tasks...
          </h2>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-red-500 dark:text-red-400 text-center">
            {error}
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center flex items-center gap-2">
          <ListChecks className="w-6 h-6" />
          Tasks
        </h2>

        {/* Task Input */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            onClick={handleCreateTask}
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                Adding...
              </div>
            ) : (
              <div className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4 inline-block" />
                Add
              </div>
            )}
          </button>
        </div>

        {/* Task List */}
        <div>
          {tasks.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-4">
              No tasks yet. Add some!
            </div>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleToggleComplete(task._id, !task.completed)
                      }
                      className="rounded-full"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-400 dark:border-gray-300" />
                      )}
                    </button>
                    {editingTaskId === task._id ? (
                      <>
                        <input
                          type="text"
                          value={editedTaskTitle}
                          onChange={(e) => setEditedTaskTitle(e.target.value)}
                          className="flex-1 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleFinishEdit(task._id)}
                          className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <span
                        className={`flex-1 text-gray-900 dark:text-white ${
                          task.completed &&
                          "line-through text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingTaskId !== task._id && (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
