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

## API Endpoints

### Health Check

- **GET** `/health` - Server status and information

### Clues

- **GET** `/api/clues/:clueId` - Get a specific clue by ID

### Root

- **GET** `/` - API information and available endpoints

## Sample Data

The server includes mock data for testing:

- `clue-1`: The Hidden Library
- `clue-2`: Secret Garden Path
- `clue-3`: The Clock Tower Mystery

## Development

- **Port**: 3000 (configurable via PORT environment variable)
- **Auto-reload**: Uses nodemon for development
- **CORS**: Enabled for all origins (configure as needed for production)

## Future Enhancements

- Database integration
- User authentication
- Real-time updates
- Image upload handling
- Leaderboard system
