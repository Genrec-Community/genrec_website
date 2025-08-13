-- Genrec AI Website Database Schema
-- Production-grade schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'in_progress', 'qualified', 'converted', 'closed');
CREATE TYPE conversation_status AS ENUM ('active', 'ended', 'abandoned');
CREATE TYPE message_sender AS ENUM ('user', 'bot', 'system');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE feedback_type AS ENUM ('general', 'conversation', 'feature', 'bug');
CREATE TYPE interaction_type AS ENUM ('page_view', 'button_click', 'form_submit', 'download', 'email_signup');

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    source VARCHAR(100) DEFAULT 'website',
    status contact_status DEFAULT 'new',
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    status conversation_status DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    sender_type message_sender NOT NULL,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    feedback_text TEXT,
    feedback_type feedback_type DEFAULT 'general',
    user_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactions table
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    interaction_type interaction_type NOT NULL,
    source VARCHAR(100),
    data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_contacts_source ON contacts(source);

CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_sender_type ON messages(sender_type);

CREATE INDEX idx_feedback_conversation_id ON feedback(conversation_id);
CREATE INDEX idx_feedback_session_id ON feedback(session_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_type ON feedback(feedback_type);

CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_session_id ON interactions(session_id);
CREATE INDEX idx_interactions_type ON interactions(interaction_type);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Full-text search indexes
CREATE INDEX idx_contacts_search ON contacts USING gin(to_tsvector('english', name || ' ' || email || ' ' || COALESCE(company, '')));
CREATE INDEX idx_feedback_search ON feedback USING gin(to_tsvector('english', COALESCE(feedback_text, '')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for now (you can restrict this later)
CREATE POLICY "Allow anonymous access" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON messages FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON feedback FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON interactions FOR ALL USING (true);

-- Create views for analytics
CREATE VIEW contact_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_contacts,
    COUNT(*) FILTER (WHERE status = 'new') as new_contacts,
    COUNT(*) FILTER (WHERE status = 'qualified') as qualified_contacts,
    COUNT(*) FILTER (WHERE status = 'converted') as converted_contacts,
    source
FROM contacts 
GROUP BY DATE_TRUNC('day', created_at), source
ORDER BY date DESC;

CREATE VIEW conversation_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_conversations,
    COUNT(*) FILTER (WHERE status = 'active') as active_conversations,
    COUNT(*) FILTER (WHERE status = 'ended') as ended_conversations,
    AVG(EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))/60) as avg_duration_minutes
FROM conversations 
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

CREATE VIEW feedback_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_feedback,
    AVG(rating) as average_rating,
    COUNT(*) FILTER (WHERE rating >= 8) as positive_feedback,
    COUNT(*) FILTER (WHERE rating <= 5) as negative_feedback,
    feedback_type
FROM feedback 
WHERE rating IS NOT NULL
GROUP BY DATE_TRUNC('day', created_at), feedback_type
ORDER BY date DESC;

-- Insert some sample data (optional)
INSERT INTO contacts (name, email, company, message, source) VALUES
('John Doe', 'john@example.com', 'Tech Corp', 'Interested in AI solutions', 'website'),
('Jane Smith', 'jane@startup.com', 'Startup Inc', 'Need consultation', 'referral');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database schema created successfully! 🎉' as message;
