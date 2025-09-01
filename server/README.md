# NFC Scavenger Hunt Server

Backend server for the NFC Scavenger Hunt mobile application.

## Architecture

This server follows a **Model-View-Controller (MVC)** pattern with the following structure:

```
src/
├── controllers/     # Handle HTTP requests and responses
├── services/        # Business logic layer
├── models/          # Database models and queries
├── middleware/      # Authentication and error handling
├── routes/          # Route definitions
├── utils/           # Utility functions and custom errors
├── db.ts           # Database connection
└── index.ts        # Main application entry point
```

## Features

- **MVC Architecture**: Clean separation of concerns
- **Authentication Middleware**: Standardized user verification
- **Custom Error Handling**: Consistent error responses
- **RESTful API endpoints**: Properly structured routes
- **CORS enabled**: Mobile app integration
- **Database Models**: Object-oriented database interactions
- **Service Layer**: Centralized business logic

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
brew install --cask docker && brew install docker-compose
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

## API Endpoints

### Authentication

The server uses a simple user ID-based authentication system. User ID can be passed:

- **GET requests**: As query parameter `?userId=123`
- **POST requests**: In request body `{"userId": 123}`

### Users

- `POST /api/users/register` - Register new user
- `GET /api/users/profile?userId=123` - Get user profile (authenticated)

### Clues

- `GET /api/clues?userId=123` - Get user's unlocked clues (authenticated)
- `GET /api/clues/:clueId?userId=123` - Get specific clue (authenticated, requires unlock)
- `POST /api/clues/:clueId/unlock` - Unlock a clue with password (authenticated)

### Backwards Compatibility

- `POST /api/register` - Redirects to `/api/users/register`

## Database Models

### User Model

- `User.findById(id)` - Find user by ID
- `User.findByUsername(username)` - Find user by username
- `User.create(username)` - Create new user
- `User.exists(id)` - Check if user exists

### Clue Model

- `Clue.findById(id)` - Find clue by ID
- `Clue.findAll()` - Get all clues
- `Clue.findPreviousClues(orderIndex)` - Get clues before given order
- `clue.verifyPassword(password)` - Verify clue password

### UserProgress Model

- `UserProgress.findByUserAndClue(userId, clueId)` - Check unlock status
- `UserProgress.getUserUnlockedClues(userId)` - Get user's unlocked clues
- `UserProgress.hasUserUnlockedClue(userId, clueId)` - Check if unlocked
- `UserProgress.create(userId, clueId)` - Record clue unlock

## Services

### UserService

- Handles user registration and validation
- Validates username requirements
- Manages user authentication

### ClueService

- Manages clue retrieval and unlocking
- Enforces lock state requirements
- Validates passwords and prerequisites

## Middleware

### Authentication (`/middleware/auth.ts`)

- `requireAuth` - Validates user ID and ensures user exists
- `optionalAuth` - Non-failing auth for optional authentication

### Error Handler (`/middleware/errorHandler.ts`)

- Handles custom application errors
- Database constraint violations
- Generic server errors

## Error Types

- `ValidationError` (400) - Invalid input data
- `UnauthorizedError` (401) - Invalid credentials
- `ForbiddenError` (403) - Access denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource already exists
- `LockedError` (423) - Resource locked/unavailable
