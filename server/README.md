# NFC Scavenger Hunt Server

Backend server for the NFC Scavenger Hunt mobile application.

## Features

- RESTful API endpoints
- CORS enabled for mobile app integration
- Health check endpoint
- Clue management endpoints
- Error handling and validation

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables:**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server:**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```
