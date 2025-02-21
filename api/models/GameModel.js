const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    scores: { type: Map, of: Number }, // Map of userId -> score
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Game", GameSchema);
