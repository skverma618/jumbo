# Project Name
Jumbo Quiz Game

## Overview
This project is created as an assignment for Jumbo. It is a 2 player real time quiz game where we leverage socket.io to let the users compete in real time.

## Getting Started

### Prerequisites
You will need to update your Mongodb uri in the api/.env file to perfectly run the api.
MONGO_URI:

### Installation
## 1. Clone the repository:
   ```bash
   git clone https://github.com/skverma618/jumbo.git
   cd jumbo
   ```

## 2. Terminal 1
   ```bash
   cd api
   npm install
   node server.js
   ```

   It will run on post 3000

## 3. Terminal 2
   ```bash
   cd client
   npm install
   npm run dev
   ```
   App will run on http://localhost:5173/
   (NOTE: as of now, it does not have a register route on frontend, so please try creating two user through postman). After that, login and game play works great.

## 4. Use POSTMAN for Registreing user please:
   url - http://localhost:3000/api/register (post request)
   body:
    user1 -> { "username": "player1", "email": "player1@example.com", "password": "password123" }
    user2 -> { "username": "player2", "email": "player2@example.com", "password": "password123" }

After this, you may try login in and playing game through UI itself