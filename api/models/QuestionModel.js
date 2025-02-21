const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

module.exports = mongoose.model("Question", QuestionSchema);
