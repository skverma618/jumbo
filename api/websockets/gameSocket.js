const Game = require("../models/GameModel")
const Question = require("../models/QuestionModel");

module.exports = (io) => {
    const gameRooms = new Map();

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("join-game", async ({ gameId, userId }) => {
            socket.join(gameId);
            if (!gameRooms.has(gameId)) gameRooms.set(gameId, {});

            gameRooms.get(gameId)[userId] = { score: 0, currentIndex: 0 };

            const game = await Game.findById(gameId).populate("questions");
            if (game && game.questions.length > 0) {
                socket.emit("question:send", game.questions[0]);
            }
        });

        socket.on("answer:submit", async ({ gameId, userId, answer }) => {
            const game = await Game.findById(gameId).populate("questions");
            if (!game) return;

            const userGame = gameRooms.get(gameId)[userId];
            const currentQuestion = game.questions[userGame.currentIndex];

            if (currentQuestion.correctAnswer === answer) {
                userGame.score += 1;
            }

            userGame.currentIndex += 1;

            if (userGame.currentIndex < game.questions.length) {
                socket.emit("question:send", game.questions[userGame.currentIndex]);
            } else {
                if (Object.keys(gameRooms.get(gameId)).length === 2) {
                    const scores = gameRooms.get(gameId);
                    const winner =
                        scores[Object.keys(scores)[0]].score >
                            scores[Object.keys(scores)[1]].score
                            ? Object.keys(scores)[0]
                            : Object.keys(scores)[1];

                    io.to(gameId).emit("game:end", { winner });
                    game.completed = true;
                    game.winner = winner;
                    await game.save();
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
