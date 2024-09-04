-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    image_url TEXT,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_sku ON products (sku);

CREATE INDEX idx_username ON users (username);

CREATE INDEX idx_email ON users (email);