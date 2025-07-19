# Leaderboard App (React + TypeScript + Vite)

> This is a real-time leaderboard web application built with React, TypeScript, Vite, and Socket.IO.

## Features

- Add users to the leaderboard
- Real-time updates across all clients using WebSockets
- Backend API for user management

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Backend server (Express + MongoDB, see below)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root with the following:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the App

Start the development server:

```sh
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Backend Setup

You need a backend server running at the URL specified in `VITE_API_URL`.

Example backend (Express + MongoDB):

```js
const express = require("express");
const User = require("../models/users");
module.exports = (io) => {
  const router = express.Router();
  router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
  router.post("/", async (req, res) => {
    const { name } = req.body;
    const newUser = new User({ name });
    await newUser.save();
    io.emit("new_user_added", newUser);
    res.json(newUser);
  });
  return router;
};
```

## Usage

- Click "Add Users" to add a new user to the leaderboard.
- All connected clients will see updates in real time.

## Development

- React + TypeScript + Vite
- Uses Socket.IO for real-time communication
- Axios for HTTP requests

## License

MIT
