const router = require("express").Router();
const {
  createUser,
  loginUser,
  getUserProfile,
  updateUserEmail,
  updateUserPassword,
  deleteUser,
} = require("../controllers/user.js");
const auth = require("../middleware/auth.js");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);
router.patch("/email/:userId", auth, updateUserEmail);
router.patch("/password/:userId", auth, updateUserPassword);
router.delete("/:userId", auth, deleteUser);

module.exports = router;
