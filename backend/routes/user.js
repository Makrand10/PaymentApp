const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Signup validation
const signupSchema = zod.object({
  username: zod.string().min(3).max(30),
  password: zod.string().min(6),
  firstName: zod.string().max(50),
  lastName: zod.string().max(50)
});

// 🔹 Signup route
router.post("/signup", async (req, res) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    console.log("Validation errors:", result.error.issues);
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.issues
    });
  }

  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const dbUser = await User.create(req.body);

  // Create account for the new user
  await Account.create({
    userId: dbUser._id,
    balance: 0
  });

  const token = jwt.sign({ userID: dbUser._id }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token
  });
});

// 🔹 Signin
const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string()
});

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password // In production, use bcrypt!
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userID: user._id }, JWT_SECRET);

  res.json({
    message: "Signed in successfully",
    token
  });
});

module.exports = router;
