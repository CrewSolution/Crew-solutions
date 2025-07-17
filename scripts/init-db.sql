-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'shop' or 'apprentice'
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    business_name VARCHAR(255),
    owner_name VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(20),
    business_type VARCHAR(255),
    license_number VARCHAR(255),
    date_of_birth DATE,
    experience_level VARCHAR(50),
    education VARCHAR(50),
    school_name VARCHAR(255),
    major VARCHAR(255),
    hours_completed INTEGER DEFAULT 0,
    availability VARCHAR(50),
    transportation BOOLEAN DEFAULT FALSE,
    willing_to_travel BOOLEAN DEFAULT FALSE,
    skills TEXT[], -- Array of strings
    rating NUMERIC(2,1) DEFAULT 0.0,
    jobs_completed INTEGER DEFAULT 0,
    goals TEXT,
    bio TEXT,
    profile_image TEXT,
    bank_account TEXT,
    routing_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    profile_complete BOOLEAN DEFAULT FALSE
);

-- Create the job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id VARCHAR(255) PRIMARY KEY,
    shop_id VARCHAR(255) NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    apprentices_needed INTEGER NOT NULL,
    expected_duration VARCHAR(255),
    days_needed INTEGER,
    start_date DATE NOT NULL,
    hours_per_day INTEGER,
    work_days TEXT[], -- Array of strings (e.g., ['Monday', 'Wednesday'])
    pay_rate VARCHAR(255) NOT NULL,
    requirements TEXT[], -- Array of strings
    required_skills TEXT[], -- Array of strings
    priority VARCHAR(50) NOT NULL, -- 'high', 'medium', 'low'
    status VARCHAR(50) NOT NULL, -- 'active', 'filled', 'paused'
    applicants INTEGER DEFAULT 0,
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_cost NUMERIC(10,2),
    weekly_payment NUMERIC(10,2)
);

-- Create the active_jobs table
CREATE TABLE IF NOT EXISTS active_jobs (
    id VARCHAR(255) PRIMARY KEY,
    job_posting_id VARCHAR(255) REFERENCES job_postings(id),
    shop_id VARCHAR(255) NOT NULL REFERENCES users(id),
    apprentice_id VARCHAR(255) NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    apprentice_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    days_worked INTEGER DEFAULT 0,
    total_days INTEGER NOT NULL,
    hours_per_day INTEGER NOT NULL,
    pay_rate VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'in-progress', 'completed', 'reviewed'
    total_hours INTEGER DEFAULT 0,
    pending_hours INTEGER DEFAULT 0,
    can_complete BOOLEAN DEFAULT FALSE,
    can_submit_hours BOOLEAN DEFAULT FALSE
);

-- Create the time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
    id VARCHAR(255) PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL REFERENCES active_jobs(id),
    apprentice_id VARCHAR(255) NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    hours NUMERIC(4,2) NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Create the job_invitations table
CREATE TABLE IF NOT EXISTS job_invitations (
    id VARCHAR(255) PRIMARY KEY,
    job_posting_id VARCHAR(255) NOT NULL REFERENCES job_postings(id),
    shop_id VARCHAR(255) NOT NULL REFERENCES users(id),
    apprentice_id VARCHAR(255) NOT NULL REFERENCES users(id),
    shop_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    pay_rate VARCHAR(255) NOT NULL,
    days_needed INTEGER,
    start_date DATE NOT NULL,
    hours_per_day INTEGER,
    work_days TEXT[],
    requirements TEXT[],
    required_skills TEXT[],
    location VARCHAR(255),
    priority VARCHAR(50),
    total_pay NUMERIC(10,2),
    weekly_pay NUMERIC(10,2),
    status VARCHAR(50) NOT NULL, -- 'pending', 'accepted', 'declined'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(255) PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL REFERENCES active_jobs(id),
    reviewer_id VARCHAR(255) NOT NULL REFERENCES users(id),
    reviewee_id VARCHAR(255) NOT NULL REFERENCES users(id),
    reviewer_type VARCHAR(50) NOT NULL, -- 'shop' or 'apprentice'
    rating NUMERIC(2,1) NOT NULL,
    comment TEXT,
    ratings JSONB, -- Store detailed ratings as JSON
    skills_shown TEXT[], -- Array of strings
    job_title VARCHAR(255),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial data (optional, but good for testing)
INSERT INTO users (id, type, email, password, business_name, owner_name, phone, address, city, state, zip_code, license_number, rating, jobs_completed, created_at, profile_complete)
VALUES
('shop-1', 'shop', 'shop@example.com', '$2a$10$yF.0.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1', 'Bay Area Electric Co.', 'John Smith', '(415) 555-0123', '123 Main Street', 'San Francisco', 'CA', '94102', 'C10-123456', 4.8, 25, NOW(), TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, type, email, password, first_name, last_name, phone, address, city, state, zip_code, experience_level, availability, skills, rating, jobs_completed, hours_completed, created_at, profile_complete)
VALUES
('apprentice-1', 'apprentice', 'apprentice@example.com', '$2a$10$yF.0.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1', 'Marcus', 'Chen', '(415) 555-0124', '456 Oak Street', 'San Francisco', 'CA', '94103', 'basic-experience', 'full-time', ARRAY['Wiring Installation', 'Safety Protocols', 'Hand Tools'], 4.6, 8, 1200, NOW(), TRUE)
ON CONFLICT (id) DO NOTHING;

-- Add more sample data if needed for other tables
-- Example for job_postings (assuming shop-1 exists)
INSERT INTO job_postings (id, shop_id, title, description, apprentices_needed, expected_duration, days_needed, start_date, hours_per_day, work_days, pay_rate, requirements, required_skills, priority, status, applicants, posted_date)
VALUES
('job-1', 'shop-1', 'Residential Wiring Project', 'Need an apprentice for a new home wiring project.', 1, '2 weeks', 10, '2025-08-01', 8, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '$25/hour', ARRAY['Must have basic tools'], ARRAY['Wiring Installation', 'Safety Protocols'], 'high', 'active', 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Example for active_jobs (assuming job-1 and apprentice-1 exist)
INSERT INTO active_jobs (id, job_posting_id, shop_id, apprentice_id, title, shop_name, apprentice_name, start_date, total_days, hours_per_day, pay_rate, status)
VALUES
('active-job-1', 'job-1', 'shop-1', 'apprentice-1', 'Residential Wiring Project', 'Bay Area Electric Co.', 'Marcus C.', '2025-08-01', 10, 8, '$25/hour', 'in-progress')
ON CONFLICT (id) DO NOTHING;
