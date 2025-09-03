# Migration from Express.js to Vercel Serverless

This document explains the file organization after migrating from Express.js server to Vercel serverless functions.

## New File Structure

```
.
├── server/                      # Server-side code and deployment
│   ├── api/                     # Vercel serverless functions
│   │   ├── health.ts            # Health check endpoint
│   │   ├── users/
│   │   │   ├── register.ts      # User registration
│   │   │   └── profile.ts       # User profile
│   │   └── clues/
│   │       ├── index.ts         # Get user's clues
│   │       ├── [id].ts          # Get specific clue
│   │       └── [id]/
│   │           └── unlock.ts    # Unlock a clue
│   ├── lib/                     # Shared utilities
│   │   ├── supabase.ts          # Supabase client configuration
│   │   ├── api.ts               # Frontend API client
│   │   └── types.ts             # Shared TypeScript types
│   ├── database/                # Database schemas
│   │   ├── supabase-setup.sql   # Complete Supabase setup script
│   │   └── schema.sql           # General PostgreSQL schema
│   ├── DEPLOYMENT.md            # Deployment instructions
│   └── MIGRATION.md             # This file
│
├── vercel.json                  # Vercel deployment configuration
└── .env.example                 # Environment variables template
```

## Legacy Files (Can be removed after successful deployment)

The following files are from the old Express.js server and can be safely removed once you've successfully deployed to Vercel and confirmed everything works:

### Server Directory
```
server/                          # Entire directory can be removed
├── src/                         # Old Express.js source code
├── scripts/                     # Old database scripts
├── schema.sql                   # Old schema (consolidated into database/)
├── clues.json                   # Sample data (now in database/supabase-setup.sql)
├── package.json                 # Server-specific dependencies
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Dependencies Cleanup
After removing the server directory, you can also remove server-specific dependencies from the main `package.json`:

**Dependencies that were server-only (can be removed):**
- `cors`
- `express`
- `pg` (replaced with `@supabase/supabase-js`)
- `@types/express`
- `@types/pg`
- `@types/cors`
- `nodemon`
- `tsx`

**Keep these dependencies:**
- `@supabase/supabase-js` (new)
- `zod` (moved to main package.json)
- All existing React Native/Expo dependencies

## Migration Checklist

Before removing legacy files, ensure:

- [ ] Vercel deployment is successful
- [ ] Supabase database is set up and populated
- [ ] All API endpoints are working (`/api/health`, `/api/users/register`, etc.)
- [ ] Frontend can register users and load clues
- [ ] Environment variables are properly configured

## Rollback Plan

If you need to rollback to the Express.js server:

1. The `server/` directory contains the original working server
2. Restore the original `package.json` dependencies
3. Set up the original PostgreSQL database using `server/schema.sql`
4. Run the server with `npm run dev` from the `server/` directory

## Benefits of the New Architecture

1. **Serverless**: Auto-scaling, no server maintenance
2. **Managed Database**: Supabase handles backups, scaling, and maintenance
3. **Simpler Deployment**: Git push to deploy
4. **Better Performance**: CDN distribution, edge functions
5. **Cost Effective**: Pay only for usage

## File Organization Decisions

- **`vercel.json` at root**: Required by Vercel for deployment configuration
- **`api/` at root**: Vercel convention for serverless functions
- **`database/` directory**: Centralized location for all database-related files
- **`lib/` directory**: Shared utilities between frontend and API functions
- **Environment files at root**: Standard convention for environment variables