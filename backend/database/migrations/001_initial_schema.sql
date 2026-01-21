-- 1. Categories Table (Fixed Reference)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO categories (name) VALUES 
('Economic'), ('Entertainment'), ('Politic'), ('Life'), ('Sport'), ('Technology');

-- 2. Documents Table (The Latest Prediction)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    confidence_score DECIMAL(5, 4),
    model_version VARCHAR(20), -- Added here to know which model made the latest prediction
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. History Log Table (The Audit Trail)
CREATE TABLE history_log (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    action_type VARCHAR(50),      -- 'INITIAL_PREDICTION' or 'RE-CLASSIFIED'
    category_id INTEGER REFERENCES categories(id),
    confidence_score DECIMAL(5, 4),
    model_version VARCHAR(20),
    prediction_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Automation: Automatically log predictions to history_log
CREATE OR REPLACE FUNCTION log_prediction_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO history_log (document_id, action_type, category_id, confidence_score, model_version)
    VALUES (NEW.id, 'PREDICTION', NEW.category_id, NEW.confidence_score, NEW.model_version);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_log_prediction
    AFTER INSERT OR UPDATE ON documents
    FOR EACH ROW
    EXECUTE PROCEDURE log_prediction_history();