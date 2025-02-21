const Game = require("../models/GameModel")
const Question = require("../models/QuestionModel");
const User = require("../models/UserModel");

module.exports = (io) => {
    const gameRooms = new Map();

    io.on("connection", (socket) => {
        socket.on("join-game", async ({ gameId, userId }) => {
            console.log(`Player ${userId} joining game ${gameId}`);
            socket.join(gameId);
            
            if (!gameRooms.has(gameId)) {
                console.log('Creating new game room');
                gameRooms.set(gameId, {
                    players: {},
                    currentQuestion: 0,
                    playersReady: 0
                });
            }

            const gameRoom = gameRooms.get(gameId);
            gameRoom.players[userId] = { score: 0, ready: false };
            
            for(let key in gameRoom.players) {
                console.log(key, " -- ", gameRoom.players[key]);
            }
            const playerCount = Object.keys(gameRoom.players).length;
            console.log(`Current player count: ${playerCount}`);

            if (playerCount === 2) {
                console.log('Second player joined, notifying all players');
                const game = await Game.findById(gameId).populate("questions");
                if (game && game.questions.length > 0) {
                    // Emit to all players in the room that the game is ready to start
                    io.to(gameId).emit("game:ready");
                }
            }
        });

        socket.on("player:ready", ({ gameId, userId }) => {
            console.log(`Player ${userId} ready in game ${gameId}`);
            const gameRoom = gameRooms.get(gameId);
            if (!gameRoom) {
                console.log('No game room found');
                return;
            }

            gameRoom.players[userId].ready = true;
            gameRoom.playersReady += 1;
            console.log(`Players ready: ${gameRoom.playersReady}`);

            if (gameRoom.playersReady === 2) {
                console.log('Both players ready, sending next question');
                sendNextQuestion(gameId, io, gameRoom);
                gameRoom.playersReady = 0;
            }
        });

        socket.on("answer:submit", async ({ gameId, userId, answer }) => {
            const game = await Game.findById(gameId).populate("questions");
            if (!game) return;

            const gameRoom = gameRooms.get(gameId);
            const userGame = gameRoom.players[userId];
            const currentQuestion = game.questions[gameRoom.currentQuestion];

            if (currentQuestion.correctAnswer === answer) {
                userGame.score += 1;
            }

            userGame.ready = false;
            gameRoom.currentQuestion += 1;
            sendNextQuestion(gameId, io, gameRoom);
            if (gameRoom.currentQuestion < game.questions.length) {
                io.to(gameId).emit("game:ready");
            } else {
                const scores = gameRoom.players;
                const winner = Object.entries(scores).reduce((a, b) => 
                    (a[1].score > b[1].score ? a : b))[0];

                const winnerUsername = await User.findById(winner);
                
                io.to(gameId).emit("game:end", { winner, winnerUsername });
                game.completed = true;
                game.winner = winner;
                await game.save();
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

function sendNextQuestion(gameId, io, gameRoom) {
    console.log('Attempting to send next question for game:', gameId);
    console.log('Current question index:', gameRoom.currentQuestion);
    
    Game.findById(gameId).populate("questions")
        .then(game => {
            console.log('Game found:', game ? 'yes' : 'no');
            console.log('Number of questions:', game?.questions?.length);
            if (game && game.questions[gameRoom.currentQuestion]) {
                const questionToSend = game.questions[gameRoom.currentQuestion];
                console.log('Sending question:', questionToSend);
                io.to(gameId).emit("question:send", questionToSend);
            } else {
                console.log('No question available to send');
            }
        })
        .catch(err => {
            console.error('Error sending next question:', err);
        });
}
