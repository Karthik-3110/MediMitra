-- Create database
CREATE DATABASE medimitra;

-- Connect to database
\c medimitra;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('hospital_staff', 'insurance_staff', 'admin')),
    organization VARCHAR(100),
    specialization VARCHAR(100),
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(100),
    reset_token VARCHAR(100),
    reset_token_expiry TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    document_type VARCHAR(50),
    patient_name VARCHAR(100),
    patient_age INTEGER,
    patient_gender VARCHAR(10),
    visit_date DATE,
    diagnosis_summary TEXT,
    extracted_text TEXT,
    analysis_result JSONB,
    icd10_codes JSONB,
    cpt_codes JSONB,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    confidence_score DECIMAL(3,2),
    is_urgent BOOLEAN DEFAULT false,
    metadata JSONB,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims table
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
    claim_number VARCHAR(50) UNIQUE,
    patient_name VARCHAR(100),
    patient_id VARCHAR(50),
    insurance_provider VARCHAR(100),
    insurance_plan VARCHAR(100),
    policy_number VARCHAR(50),
    total_amount DECIMAL(10,2),
    covered_amount DECIMAL(10,2),
    patient_responsibility DECIMAL(10,2),
    diagnosis_codes JSONB,
    procedure_codes JSONB,
    claim_date DATE,
    submission_date DATE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'processing', 'approved', 'rejected', 'paid', 'appealed')),
    rejection_reason TEXT,
    notes TEXT,
    assignee_id INTEGER REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat History table
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100),
    message_type VARCHAR(20) CHECK (message_type IN ('user', 'ai', 'system')),
    message TEXT NOT NULL,
    response TEXT,
    context JSONB,
    is_medical BOOLEAN DEFAULT false,
    confidence_score DECIMAL(3,2),
    suggested_codes JSONB,
    language VARCHAR(10) DEFAULT 'en',
    message_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error', 'claim_update', 'document_processed')),
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_insurance_provider ON claims(insurance_provider);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create some sample data for testing
INSERT INTO users (full_name, email, password_hash, role, organization) VALUES
('Dr. Rajesh Kumar', 'rajesh@aiims.com', '$2b$10$YourHashedPasswordHere', 'hospital_staff', 'AIIMS Delhi'),
('Insurance Officer', 'officer@hdfcergo.com', '$2b$10$YourHashedPasswordHere', 'insurance_staff', 'HDFC Ergo'),
('System Admin', 'admin@medimitra.com', '$2b$10$YourHashedPasswordHere', 'admin', 'Mediमित्र');

-- Create views for common queries
CREATE VIEW recent_activities AS
SELECT 
    'claim' as type,
    claim_number as identifier,
    status,
    updated_at as timestamp
FROM claims
UNION ALL
SELECT 
    'document' as type,
    filename as identifier,
    status,
    processed_at as timestamp
FROM documents
ORDER BY timestamp DESC;

-- Create materialized view for dashboard statistics
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'hospital_staff') as hospital_staff_count,
    (SELECT COUNT(*) FROM users WHERE role = 'insurance_staff') as insurance_staff_count,
    (SELECT COUNT(*) FROM documents) as total_documents,
    (SELECT COUNT(*) FROM claims) as total_claims,
    (SELECT COUNT(*) FROM claims WHERE status = 'approved') as approved_claims,
    (SELECT COUNT(*) FROM claims WHERE status = 'rejected') as rejected_claims,
    (SELECT COUNT(*) FROM claims WHERE status = 'processing') as processing_claims,
    (SELECT COALESCE(SUM(total_amount), 0) FROM claims WHERE status = 'approved') as total_approved_amount;

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id INTEGER)
RETURNS TABLE(
    total_documents BIGINT,
    total_claims BIGINT,
    approved_claims BIGINT,
    pending_claims BIGINT,
    recent_activity JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM documents d WHERE d.user_id = get_user_stats.user_id) as total_documents,
        (SELECT COUNT(*) FROM claims c WHERE c.user_id = get_user_stats.user_id) as total_claims,
        (SELECT COUNT(*) FROM claims c WHERE c.user_id = get_user_stats.user_id AND c.status = 'approved') as approved_claims,
        (SELECT COUNT(*) FROM claims c WHERE c.user_id = get_user_stats.user_id AND c.status IN ('draft', 'submitted', 'processing')) as pending_claims,
        (SELECT json_agg(row_to_json(t)) FROM (
            SELECT 'document' as type, filename as name, uploaded_at as time
            FROM documents 
            WHERE user_id = get_user_stats.user_id 
            ORDER BY uploaded_at DESC 
            LIMIT 5
            UNION ALL
            SELECT 'claim' as type, claim_number as name, updated_at as time
            FROM claims 
            WHERE user_id = get_user_stats.user_id 
            ORDER BY updated_at DESC 
            LIMIT 5
        ) t) as recent_activity;
END;
$$ LANGUAGE plpgsql;