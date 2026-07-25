# Founders Academy Bot & Dashboard

This repository contains the backend and frontend for the Founders Academy project, including a Telegram bot integration, registration system, admin dashboard, and database connection.

## Environment Variables

Copy `.env.example` to `.env` and configure your credentials:

- `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token
- `TELEGRAM_CHANNEL_ID`: Channel ID for user access
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anon/publishable key
- `DATABASE_URL`: Postgres database connection string
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `JWT_SECRET`: Secret key for JWT token signing

## Deployment

Deploy Edge Function to Supabase:
```bash
npx supabase link --project-ref yrelqbvkxwdkzaraydfz
npx supabase functions deploy api --no-verify-jwt
```
