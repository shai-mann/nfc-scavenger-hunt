-- NFC Scavenger Hunt Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clues table
CREATE TABLE IF NOT EXISTS clues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    bits_name VARCHAR(255) NOT NULL,
    data JSONB, -- Clue data is stored as raw JSON, to avoid restricting the data structure
    nfc_tag_id VARCHAR(255) NOT NULL, -- This serves as the password for unlocking
    order_index INTEGER DEFAULT 0,
    lock_state VARCHAR(255) DEFAULT 'none'
);

-- Create user_progress table to track which clues users have unlocked
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    clue_id UUID REFERENCES clues(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, clue_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_clue_id ON user_progress(clue_id);
CREATE INDEX IF NOT EXISTS idx_clues_order_index ON clues(order_index);

-- Enable Row Level Security (RLS) for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clues DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're using simple auth)
-- Note: In production, you'd want more restrictive policies

-- Users can read all users (for profile lookups)
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
-- Anyone can create a record (register a new user)
CREATE POLICY "Anyone can insert a new user" ON users FOR INSERT WITH CHECK (true);
-- Users can update their own record
CREATE POLICY "Users can update their own record" ON users FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Users can read all progress (needed for leaderboard checks)
CREATE POLICY "Users can read all progress" ON user_progress FOR SELECT USING (true);
-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (userId = auth.uid());
-- Users can read all clues
CREATE POLICY "Users can read all clues" ON clues FOR SELECT USING (true)