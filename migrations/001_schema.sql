-- AI Portfolio Database Schema
-- Run this migration to create all required tables

-- Candidate profile (single row - the portfolio owner)
CREATE TABLE IF NOT EXISTS candidate_profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    taglines TEXT[] DEFAULT '{}',
    bio TEXT,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'open', -- open, not_looking, selective
    preferred_roles TEXT[] DEFAULT '{}',
    preferred_company_stages TEXT[] DEFAULT '{}',
    years_experience INTEGER,
    education_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work experiences with AI context fields
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL means current
    location VARCHAR(100),
    description TEXT,
    -- AI Context Fields
    situation TEXT, -- What was the context/challenge?
    approach TEXT, -- How did you approach it?
    technical_work TEXT, -- Specific technical contributions
    lessons_learned TEXT, -- Key takeaways
    highlights TEXT[] DEFAULT '{}', -- Bullet points for quick display
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills with proficiency levels
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    proficiency VARCHAR(20) NOT NULL DEFAULT 'moderate', -- strong, moderate, gap
    years_used INTEGER,
    context TEXT, -- Additional context for AI
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Explicit gaps and weaknesses (for honest AI responses)
CREATE TABLE IF NOT EXISTS gaps_weaknesses (
    id SERIAL PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    is_dealbreaker BOOLEAN DEFAULT FALSE, -- If true, AI should strongly advise against roles requiring this
    mitigation TEXT, -- What you're doing to address it or how to work around it
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-written FAQ responses for common questions
CREATE TABLE IF NOT EXISTS faq_responses (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50), -- technical, process, personal, career
    is_suggested BOOLEAN DEFAULT FALSE, -- Show as suggested question in chat
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI behavior instructions and anti-sycophancy rules
CREATE TABLE IF NOT EXISTS ai_instructions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- tone, anti_sycophancy, boundaries, examples
    instruction TEXT NOT NULL,
    priority INTEGER DEFAULT 0, -- Higher = more important
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat conversation history for analytics
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- user, assistant
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JD analysis history and demo examples
CREATE TABLE IF NOT EXISTS jd_analyses (
    id SERIAL PRIMARY KEY,
    job_description TEXT NOT NULL,
    verdict VARCHAR(30) NOT NULL, -- strong_fit, worth_conversation, probably_not
    where_i_dont_fit TEXT[] DEFAULT '{}',
    what_transfers TEXT[] DEFAULT '{}',
    recommendation TEXT,
    opening_paragraph TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    demo_type VARCHAR(20), -- strong_fit, weak_fit (only for demo entries)
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin sessions for authentication
CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences(display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_proficiency ON skills(proficiency);
CREATE INDEX IF NOT EXISTS idx_chat_history_session ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created ON chat_history(created_at);
CREATE INDEX IF NOT EXISTS idx_jd_analyses_session ON jd_analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_jd_analyses_demo ON jd_analyses(is_demo);
