const express = require("express");
const Game = require("../models/GameModel");
const Question = require("../models/QuestionModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    console.log("AUTHENTICATION MIDDLEWARE CALLED");
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.userId = decoded.userId;
        next();
    });
};

// Start a new game session
router.post("/game/start", authenticate, async (req, res) => {
    console.log("START GAME ROUTE CALLED");
    const userId = req.userId;

    let game = await Game.findOne({ completed: false, players: { $size: 1 } });

    if (!game) {
        // Create a new game if no waiting player
        const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
        game = new Game({ players: [userId], questions });
        await game.save();
        return res.json({ gameId: game._id, message: "Waiting for another player..." });
    }

    // Add second player and start game
    game.players.push(userId);
    await game.save();

    res.json({ gameId: game._id, message: "Game started!" });
});

module.exports = router;
