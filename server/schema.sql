-- NFC Scavenger Hunt Database Schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lock state enum
CREATE TYPE lock_state_enum AS ENUM ('none', 'requires_previous');

-- Create clues table
CREATE TABLE IF NOT EXISTS clues (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    is_copyable BOOLEAN DEFAULT true,
    image_url TEXT,
    location VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    lock_state lock_state_enum DEFAULT 'none',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    order_index INTEGER DEFAULT 0
);

-- Create user_progress table to track which clues users have completed
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    clue_id VARCHAR(50) REFERENCES clues(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, clue_id)
);

-- Insert sample clues
INSERT INTO clues (id, title, text, is_copyable, image_url, location, password, lock_state, order_index) VALUES
('clue-1', 'The Hidden Library', 'Find the ancient tome hidden behind the third pillar from the entrance. The answer lies within its weathered pages.', true, null, 'Main Library', 'ancient_wisdom', 'none', 1),
('clue-2', 'Secret Garden Path', 'Follow the stone path that winds through the rose garden. Count the steps and remember the number.', false, null, 'Botanical Gardens', 'rose_steps', 'requires_previous', 2),
('clue-3', 'The Clock Tower Mystery', 'At exactly 3:15 PM, the shadow of the clock tower points to a hidden marker. What do you see?', true, 'https://example.com/clock-tower.jpg', 'Clock Tower Plaza', 'shadow_marker', 'requires_previous', 3)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_clue_id ON user_progress(clue_id);
CREATE INDEX IF NOT EXISTS idx_clues_order_index ON clues(order_index);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clues_updated_at BEFORE UPDATE ON clues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();