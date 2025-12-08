# TrailSathi Backend

Node.js + Express + MongoDB backend for the TrailSathi hiking community app.

## Prerequisites

- Node.js installed
- MongoDB installed and running locally (or use a cloud URI)

## Installation

1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Ensure you have a `.env` file in the root of `Server` with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trailsathi
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

## Running the Server

- **Development Mode** (requires nodemon):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

## API Features

- **Groups**: Create, join, manage hiking communities.
- **Posts**: Share updates, photos, trail logs within groups.
- **Events**: Schedule hikes, manage RSVPs (going/interested).
- **Messaging**: Direct messages between users and Group chats.
- **Authentication**: JWT-based auth (already integrated).

## Folder Structure

- `models/`: Mongoose schemas.
- `controllers/`: Request handling logic.
- `routers/`: API route definitions.
- `middlewares/`: Auth and error handling.
- `utils/`: Helper functions.
