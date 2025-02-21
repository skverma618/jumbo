const express = require("express");
const Question = require("../models/QuestionModel");

const router = express.Router();

// API Route to Add Questions
router.post("/questions/add", async (req, res) => {
  try {
    const questions = req.body; // Expecting an array of questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid questions array" });
    }

    const insertedQuestions = await Question.insertMany(questions);
    res.status(201).json({
      message: "Questions added successfully",
      data: insertedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding questions", error });
  }
});

module.exports = router;
