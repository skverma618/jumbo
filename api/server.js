require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const gameSocket = require("./websockets/gameSocket")

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", gameRoutes);

gameSocket(io);

server.listen(3000, () => console.log("Server running on port 3000"));
