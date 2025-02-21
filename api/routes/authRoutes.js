const express = require("express");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        console.log("LOGIN route called");
        const { username, password } = req.body;
        console.log("Username - ", username);
        console.log("Password - ", password);
        const user = await User.findOne({ username });
        console.log(user);
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
