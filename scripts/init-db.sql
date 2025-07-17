-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('shop', 'apprentice')),
    
    -- Common fields
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    profile_image TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    jobs_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Shop-specific fields
    business_name VARCHAR(200),
    owner_name VARCHAR(200),
    business_type VARCHAR(100),
    years_in_business INTEGER,
    license_number VARCHAR(100),
    insurance_info TEXT,
    
    -- Apprentice-specific fields
    experience_level VARCHAR(50),
    skills TEXT[], -- Array of skills
    availability VARCHAR(50),
    hourly_rate_min DECIMAL(10,2),
    hourly_rate_max DECIMAL(10,2),
    education TEXT,
    certifications TEXT[],
    bio TEXT,
    willing_to_travel BOOLEAN DEFAULT false,
    has_own_tools BOOLEAN DEFAULT false,
    has_transportation BOOLEAN DEFAULT false
);

-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    apprentices_needed INTEGER DEFAULT 1,
    expected_duration VARCHAR(100),
    days_needed INTEGER NOT NULL,
    start_date DATE NOT NULL,
    hours_per_day INTEGER DEFAULT 8,
    work_days TEXT[], -- Array of work days
    pay_rate VARCHAR(100) NOT NULL,
    requirements TEXT[],
    required_skills TEXT[],
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'filled', 'cancelled')),
    applicants INTEGER DEFAULT 0,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_cost DECIMAL(10,2),
    weekly_payment DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_invitations table
CREATE TABLE IF NOT EXISTS job_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apprentice_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shop_name VARCHAR(200) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    pay_rate VARCHAR(100) NOT NULL,
    days_needed INTEGER NOT NULL,
    start_date DATE NOT NULL,
    hours_per_day INTEGER DEFAULT 8,
    work_days TEXT[],
    requirements TEXT[],
    required_skills TEXT[],
    location VARCHAR(200),
    priority VARCHAR(20) DEFAULT 'medium',
    total_pay DECIMAL(10,2),
    weekly_pay DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create active_jobs table
CREATE TABLE IF NOT EXISTS active_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
    shop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apprentice_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    shop_name VARCHAR(200) NOT NULL,
    apprentice_name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    hours_per_day INTEGER DEFAULT 8,
    pay_rate VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'reviewed')),
    days_worked INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2) DEFAULT 0,
    pending_hours DECIMAL(5,2) DEFAULT 0,
    can_complete BOOLEAN DEFAULT false,
    can_submit_hours BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(100) NOT NULL,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_type VARCHAR(20) NOT NULL CHECK (reviewer_type IN ('shop', 'apprentice')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES active_jobs(id) ON DELETE CASCADE,
    apprentice_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours DECIMAL(4,2) NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample shop user
INSERT INTO users (
    email, password_hash, type, business_name, owner_name, first_name, last_name,
    phone, city, state, zip_code, business_type, years_in_business,
    license_number, rating, jobs_completed
) VALUES (
    'shop@example.com', 
    '$2b$10$rOvHPGkwQGKqvzjo.6.6/.X8VKWvZ8Q8i5rJFKqQqQqQqQqQqQqQq', -- password123
    'shop',
    'Elite Electrical Services',
    'John Smith',
    'John',
    'Smith',
    '(555) 123-4567',
    'San Francisco',
    'CA',
    '94102',
    'Electrical Contractor',
    15,
    'C-10 #123456',
    4.8,
    127
) ON CONFLICT (email) DO NOTHING;

-- Insert sample apprentice user
INSERT INTO users (
    email, password_hash, type, first_name, last_name, phone, city, state, zip_code,
    experience_level, skills, availability, hourly_rate_min, hourly_rate_max,
    education, bio, rating, jobs_completed, willing_to_travel, has_own_tools, has_transportation
) VALUES (
    'apprentice@example.com',
    '$2b$10$rOvHPGkwQGKqvzjo.6.6/.X8VKWvZ8Q8i5rJFKqQqQqQqQqQqQqQq', -- password123
    'apprentice',
    'Sarah',
    'Johnson',
    '(555) 987-6543',
    'Oakland',
    'CA',
    '94601',
    'Intermediate',
    ARRAY['Wiring Installation', 'Circuit Analysis', 'Blueprint Reading', 'Safety Protocols'],
    'Full-time',
    22.00,
    28.00,
    'Community College Electrical Program',
    'Dedicated electrical apprentice with 2 years of hands-on experience in residential and commercial projects.',
    4.6,
    23,
    true,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert additional sample apprentices
INSERT INTO users (
    email, password_hash, type, first_name, last_name, phone, city, state, zip_code,
    experience_level, skills, availability, hourly_rate_min, hourly_rate_max,
    education, bio, rating, jobs_completed, willing_to_travel, has_own_tools, has_transportation
) VALUES 
(
    'mike.wilson@example.com',
    '$2b$10$rOvHPGkwQGKqvzjo.6.6/.X8VKWvZ8Q8i5rJFKqQqQqQqQqQqQqQq',
    'apprentice',
    'Mike',
    'Wilson',
    '(555) 234-5678',
    'San Jose',
    'CA',
    '95101',
    'Basic Experience',
    ARRAY['Hand Tools', 'Power Tools', 'Safety Protocols', 'Basic Wiring'],
    'Part-time',
    18.00,
    22.00,
    'Trade School Graduate',
    'Eager to learn and grow in the electrical field. Strong work ethic and attention to detail.',
    4.3,
    8,
    false,
    false,
    true
),
(
    'alex.rodriguez@example.com',
    '$2b$10$rOvHPGkwQGKqvzjo.6.6/.X8VKWvZ8Q8i5rJFKqQqQqQqQqQqQqQq',
    'apprentice',
    'Alex',
    'Rodriguez',
    '(555) 345-6789',
    'Berkeley',
    'CA',
    '94702',
    'Advanced',
    ARRAY['Motor Controls', 'Panel Installation', 'Conduit Bending', 'Blueprint Reading', 'Troubleshooting'],
    'Full-time',
    25.00,
    32.00,
    'Apprenticeship Program + Community College',
    'Experienced apprentice ready to take on challenging projects. Specializes in industrial electrical work.',
    4.9,
    45,
    true,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_job_postings_shop_id ON job_postings(shop_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_invitations_apprentice_id ON job_invitations(apprentice_id);
CREATE INDEX IF NOT EXISTS idx_job_invitations_shop_id ON job_invitations(shop_id);
CREATE INDEX IF NOT EXISTS idx_job_invitations_status ON job_invitations(status);
CREATE INDEX IF NOT EXISTS idx_active_jobs_shop_id ON active_jobs(shop_id);
CREATE INDEX IF NOT EXISTS idx_active_jobs_apprentice_id ON active_jobs(apprentice_id);
CREATE INDEX IF NOT EXISTS idx_active_jobs_status ON active_jobs(status);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_job_id ON time_entries(job_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_apprentice_id ON time_entries(apprentice_id);
