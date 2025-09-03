-- NFC Scavenger Hunt Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clues table
CREATE TABLE IF NOT EXISTS clues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    nfc_tag_id VARCHAR(255) NOT NULL, -- This serves as the password for unlocking
    location_hint TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table to track which clues users have unlocked
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    clue_id UUID REFERENCES clues(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    UNIQUE(user_id, clue_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_clue_id ON user_progress(clue_id);
CREATE INDEX IF NOT EXISTS idx_clues_order_index ON clues(order_index);
CREATE INDEX IF NOT EXISTS idx_clues_is_active ON clues(is_active);

-- Insert sample clues
INSERT INTO clues (title, description, nfc_tag_id, location_hint, order_index) VALUES
    ('The Hidden Library', 'Example Text for the first clue', 'teeheepassword', 'Look for books', 1),
    ('Secret Garden Path', 'Example Text for the second clue', 'adifferentpassword', 'Follow the green path', 2),
    ('The Clock Tower Mystery', 'Example Text for the third clue', 'anotherpassword', 'Time tells all secrets', 3)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're using simple auth)
-- Note: In production, you'd want more restrictive policies

-- Users can read all users (for profile lookups)
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
-- Users can insert their own record
CREATE POLICY "Users can insert their own record" ON users FOR INSERT WITH CHECK (true);

-- Anyone can read active clues
CREATE POLICY "Anyone can read active clues" ON clues FOR SELECT USING (is_active = true);

-- Users can read all progress (needed for checking unlocks)
CREATE POLICY "Users can read all progress" ON user_progress FOR SELECT USING (true);
-- Users can insert their own progress
CREATE POLICY "Users can insert progress" ON user_progress FOR INSERT WITH CHECK (true);