const router = require("express").Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksByUser,
} = require("../controllers/task.js");
const auth = require("../middleware/auth.js");

//  Protect these routes with auth
router.post("/", auth, createTask);
router.get("/", auth, getAllTasks);
router.get("/:id", auth, getTaskById);
router.put("/:id", auth, updateTaskById);
router.delete("/:id", auth, deleteTaskById);
router.get("/user/:userId", auth, getTasksByUser);

module.exports = router;
