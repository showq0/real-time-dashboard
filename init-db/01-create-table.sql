-- This script runs automatically when the container starts
CREATE TABLE IF NOT EXISTS server_metrics (
    id SERIAL PRIMARY KEY,
    server_id FLOAT,  
    avg_cpu FLOAT,
    min_cpu FLOAT,
    max_cpu FLOAT,
    avg_memory FLOAT,
    min_memory FLOAT,
    max_memory FLOAT,
    count INT,
    timestamp TIMESTAMP DEFAULT NOW()
);
