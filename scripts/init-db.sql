-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Users (both shops and apprentices)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL, -- 'shop' or 'apprentice'
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    business_name VARCHAR(255),
    owner_name VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
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

-- Table for Job Postings by Shops
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    apprentices_needed INTEGER NOT NULL,
    expected_duration VARCHAR(255),
    days_needed INTEGER NOT NULL,
    start_date DATE NOT NULL,
    hours_per_day INTEGER NOT NULL,
    work_days TEXT[], -- Array of strings (e.g., ['Monday', 'Tuesday'])
    pay_rate VARCHAR(50) NOT NULL,
    requirements TEXT[], -- Array of strings
    required_skills TEXT[], -- Array of strings
    priority VARCHAR(20) NOT NULL, -- 'high', 'medium', 'low'
    status VARCHAR(20) NOT NULL, -- 'active', 'filled', 'paused'
    applicants INTEGER DEFAULT 0,
    posted_date DATE DEFAULT CURRENT_DATE,
    total_cost NUMERIC(10,2),
    weekly_payment NUMERIC(10,2)
);

-- Table for Active Jobs (when an apprentice accepts a job)
CREATE TABLE IF NOT EXISTS active_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id),
    shop_id UUID NOT NULL REFERENCES users(id),
    apprentice_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    apprentice_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    days_worked INTEGER DEFAULT 0,
    total_days INTEGER NOT NULL,
    hours_per_day INTEGER NOT NULL,
    pay_rate VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'in-progress', 'completed', 'reviewed'
    total_hours INTEGER DEFAULT 0,
    pending_hours INTEGER DEFAULT 0,
    can_complete BOOLEAN DEFAULT FALSE,
    can_submit_hours BOOLEAN DEFAULT TRUE
);

-- Table for Job Invitations
CREATE TABLE IF NOT EXISTS job_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id),
    shop_id UUID NOT NULL REFERENCES users(id),
    apprentice_id UUID NOT NULL REFERENCES users(id),
    shop_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    pay_rate VARCHAR(50) NOT NULL,
    days_needed INTEGER NOT NULL,
    start_date DATE NOT NULL,
    hours_per_day INTEGER NOT NULL,
    work_days TEXT[],
    requirements TEXT[],
    required_skills TEXT[],
    location VARCHAR(255),
    priority VARCHAR(20),
    total_pay NUMERIC(10,2),
    weekly_pay NUMERIC(10,2),
    status VARCHAR(20) NOT NULL, -- 'pending', 'accepted', 'declined'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL, -- Can be job_posting_id or active_job_id depending on context
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewee_id UUID NOT NULL REFERENCES users(id),
    reviewer_type VARCHAR(20) NOT NULL, -- 'shop' or 'apprentice'
    rating INTEGER NOT NULL, -- Overall rating
    comment TEXT,
    timeliness_rating INTEGER,
    work_ethic_rating INTEGER,
    material_knowledge_rating INTEGER,
    profile_accuracy_rating INTEGER,
    skills_shown TEXT[], -- Array of strings
    job_title VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES active_jobs(id),
    apprentice_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    hours NUMERIC(4,2) NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Optional: Add sample data for initial testing
INSERT INTO users (id, type, email, password, first_name, last_name, business_name, owner_name, phone, address, city, state, zip_code, license_number, hours_completed, experience_level, availability, skills, rating, jobs_completed, profile_complete) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'shop', 'shop@example.com', 'password123', NULL, NULL, 'Bay Area Electric Co.', 'John Smith', '(415) 555-0123', '123 Main St', 'San Francisco', 'CA', '94102', 'C10-123456', NULL, NULL, NULL, NULL, 4.8, 25, TRUE),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'apprentice', 'apprentice@example.com', 'password123', 'Marcus', 'Chen', NULL, NULL, '(415) 555-0124', '456 Oak St', 'San Francisco', 'CA', '94103', NULL, 1200, 'basic-experience', 'full-time', ARRAY['Wiring Installation', 'Safety Protocols', 'Hand Tools'], 4.6, 8, TRUE);

INSERT INTO job_postings (id, shop_id, title, description, apprentices_needed, expected_duration, days_needed, start_date, hours_per_day, work_days, pay_rate, requirements, required_skills, priority, status, applicants, total_cost, weekly_payment) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Residential Wiring Assistant', 'Help with residential electrical installations and repairs', 1, '2 weeks', 10, '2025-01-20', 8, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '$18-22/hour', ARRAY['Basic wiring knowledge', 'Safety protocols'], ARRAY['Wiring Installation', 'Safety Protocols'], 'medium', 'active', 0, 1600.00, 800.00);

INSERT INTO active_jobs (id, job_posting_id, shop_id, apprentice_id, title, shop_name, apprentice_name, start_date, days_worked, total_days, hours_per_day, pay_rate, status, total_hours, pending_hours, can_complete, can_submit_hours) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Residential Wiring Assistant', 'Bay Area Electric Co.', 'Marcus Chen', '2025-01-10', 8, 10, 8, '$20/hour', 'in-progress', 64, 8, TRUE, TRUE);

INSERT INTO job_invitations (id, job_posting_id, shop_id, apprentice_id, shop_name, title, description, pay_rate, days_needed, start_date, hours_per_day, work_days, requirements, required_skills, location, priority, total_pay, weekly_pay, status) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Express Electric', 'Emergency Repair Assistant', 'Urgent electrical repair needed for commercial building. Must be available immediately.', '$25/hour', 2, '2025-01-16', 8, ARRAY['Monday', 'Tuesday'], ARRAY['Available immediately', 'Basic electrical knowledge'], ARRAY['Safety Protocols', 'Hand Tools'], 'San Jose, CA', 'high', 400.00, NULL, 'pending');

INSERT INTO reviews (id, job_id, reviewer_id, reviewee_id, reviewer_type, rating, comment, timeliness_rating, work_ethic_rating, material_knowledge_rating, profile_accuracy_rating, skills_shown, job_title) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'shop', 5, 'Excellent work ethic and quick learner. Very reliable and safety-conscious.', 5, 5, 4, 5, ARRAY['Wiring Installation', 'Safety Protocols', 'Hand Tools'], 'Residential Wiring Assistant');

INSERT INTO time_entries (id, job_id, apprentice_id, date, hours, approved) VALUES
('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-10', 8.00, TRUE),
('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-11', 8.00, TRUE),
('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-12', 8.00, TRUE),
('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-13', 8.00, TRUE),
('k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-14', 8.00, TRUE),
('l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-15', 8.00, TRUE),
('m0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-16', 8.00, TRUE),
('n0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-17', 8.00, FALSE);
