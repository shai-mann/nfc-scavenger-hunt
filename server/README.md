# NFC Scavenger Hunt - Deployment Guide

This guide will help you deploy your NFC Scavenger Hunt application using Vercel serverless functions and Supabase as the database.

## Overview

The application uses a Supabase-managed PostgreSQL server with Vercel Functions to connect the client to the server

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Supabase](https://supabase.com) account
3. Node.js and npm installed locally

## Step 1: Set up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Copy and paste the contents of `server/database/schema.sql` into the SQL Editor and run it
4. Go to Settings > API to get your project URL and anon key

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Update API Base URL

In `server/lib/api.ts`, update the production URL:

```typescript
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://your-app-name.vercel.app"; // Replace with your actual Vercel URL
};
```

## Step 4: Install Dependencies

Install the new dependencies:

```bash
npm install
```

## Step 5: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy:

   ```bash
   vercel
   ```

4. Follow the prompts and add environment variables when asked

### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in the deployment settings

## Step 6: Configure Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_URL`: Your Supabase project URL (same as above)
- `SUPABASE_ANON_KEY`: Your Supabase anon key (same as above)

## Step 7: Update Your App's Base URL

After deployment, update the `getBaseUrl()` function in `server/lib/api.ts` with your actual Vercel URL.

## API Endpoints

Your API will be available at:

- `GET /api/health` - Health check
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile
- `GET /api/clues` - Get user's unlocked clues
- `GET /api/clues/[id]` - Get specific clue
- `POST /api/clues/[id]/unlock` - Unlock a clue

## Testing the Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Check that the API endpoints work by visiting `/api/health`

## Database Schema

The database schema is located in `server/database/`:

- `server/database/supabase-setup.sql` - Complete setup for Supabase (run this in Supabase SQL Editor)
- `server/database/schema.sql` - General schema compatible with both Supabase and standard PostgreSQL

### Tables:

- `users` - User accounts (id, name, email, created_at)
- `clues` - Available clues in the hunt (id, title, description, nfc_tag_id, location_hint, order_index, is_active)
- `user_progress` - Tracks which clues users have unlocked (id, user_id, clue_id, unlocked_at, completed_at)

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- The API uses simple header-based authentication (`x-user-id`)
- In production, you should implement proper JWT-based authentication

## Troubleshooting

### Common Issues

1. **API calls failing**: Check that environment variables are set correctly
2. **Database connection issues**: Verify Supabase URL and keys
3. **CORS errors**: The API routes include CORS headers for cross-origin requests

### Logs

View logs in:

- Vercel: Go to your project dashboard and check the Functions tab
- Supabase: Check the Logs section in your Supabase dashboard

## Migration Notes

### What Changed

1. **Server Structure**: Express.js app converted to individual Vercel functions
2. **Database**: PostgreSQL connection replaced with Supabase client
3. **Authentication**: Simplified to header-based (ready for JWT upgrade)
4. **Deployment**: From traditional server deployment to serverless

### Files Added/Modified

- `api/` - New Vercel serverless functions
- `lib/supabase.ts` - Supabase client configuration
- `lib/api.ts` - API client for frontend
- `lib/types.ts` - Shared types
- `vercel.json` - Vercel configuration
- `supabase-schema.sql` - Database schema for Supabase

### Legacy Files (Can be removed after successful deployment)

- `server/` directory - Old Express.js server
- Server-related dependencies in package.json

## Next Steps

1. Test all functionality thoroughly
2. Implement proper JWT authentication
3. Add rate limiting to API endpoints
4. Set up monitoring and alerting
5. Consider adding a Redis cache for performance

## Support

If you encounter issues:

1. Check Vercel function logs
2. Check Supabase logs
3. Verify environment variables are set correctly
4. Test API endpoints directly using a tool like Postman
