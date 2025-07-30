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
  try {
    console.log("Signup request received:", req.body);
    
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

    console.log("Creating user with data:", req.body);
    const dbUser = await User.create(req.body);
    console.log("User created successfully:", dbUser._id);

    // Create account for the new user
    console.log("Creating account for user:", dbUser._id);
    const account = await Account.create({
      userId: dbUser._id,
      balance: 0
    });
    console.log("Account created successfully:", account._id);

    const token = jwt.sign({ userID: dbUser._id }, JWT_SECRET);

    res.json({
      message: "User created successfully",
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// 🔹 Signin
const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string()
});

router.post("/signin", async (req, res) => {
  try {
    console.log("Signin request received:", req.body);
    
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
      console.log("Signin validation failed");
      return res.status(400).json({ message: "Invalid input" });
    }

    console.log("Looking for user with username:", req.body.username);
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password // In production, use bcrypt!
    });

    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
      console.log("No user found with these credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User authenticated successfully:", user._id);
    const token = jwt.sign({ userID: user._id }, JWT_SECRET);

    res.json({
      message: "Signed in successfully",
      token
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
