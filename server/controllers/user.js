const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function createUser(req, res) {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = new User({ email, password: hashedPassword });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ error: "Email address already in use." });
    }
    res.status(400).json({ error: "Failed to create user." });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
}

async function getUserProfile(req, res) {
  const userId = req.user;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
}

async function updateUserEmail(req, res) {
  const { newEmail } = req.body;
  const userId = req.user;

  try {
    const existingUserWithEmail = await User.findOne({ email: newEmail });
    if (existingUserWithEmail) {
      return res.status(409).json({ error: "Email address already in use." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update email.", details: error.message });
  }
}

async function updateUserPassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password." });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password." });
  }
}

async function deleteUser(req, res) {
  const userId = req.user;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
}

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserEmail,
  updateUserPassword,
  deleteUser,
};
