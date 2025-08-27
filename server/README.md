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

2.5 **Install Docker**

```bash
brew install --cask docker
```

3. **Start the database**

   ```bash
   cd server && docker-compose up -d
   ```

4. **Start the server:**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```
