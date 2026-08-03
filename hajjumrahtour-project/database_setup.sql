-- Hajj Umrah Tours Database Setup
-- Run these queries in your SQL environment (e.g., MySQL, phpMyAdmin, PostgreSQL)

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS hajj_umrah_tours;
USE hajj_umrah_tours;

-- 2. Create Users Table (For Admins and Clients)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Create Packages Table (Hajj, Umrah, Luxury, Family, etc.)
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    category ENUM('Hajj', 'Umrah', 'Travel', 'Services') NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Inquiries Table (For Contact Forms and Quotes)
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    travel_date DATE,
    travelers INT,
    package_interest VARCHAR(255),
    message TEXT,
    status ENUM('pending', 'contacted', 'converted', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    travel_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('unpaid', 'deposit_paid', 'fully_paid') DEFAULT 'unpaid',
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
);

-- 6. Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    rating INT CHECK(rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Insert Initial Package Data
INSERT INTO packages (slug, title, subtitle, description, category, price) VALUES
('luxury-umrah', 'Luxury Umrah', 'Signature journeys', 'Exceptional hotels, seamless private transfers and considered itineraries.', 'Umrah', 4500.00),
('family-umrah', 'Family Umrah', 'Family journeys', 'Flexible itineraries designed around children, parents and elderly family members.', 'Umrah', 3200.00),
('platinum-umrah', 'Platinum Umrah', 'Platinum collection', 'A premium pilgrimage arrangement balancing outstanding comfort with thoughtful value.', 'Umrah', 6000.00),
('royal-executive-umrah', 'Royal Executive', 'Discreet service at the highest level.', 'A private, flexible experience for leaders and guests who value time and absolute attention.', 'Umrah', 8500.00);

-- 8. Insert Admin User (Password is 'admin123' hashed with a standard MD5 or bcrypt, update later)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@hajjumrahtours.com', 'hashed_password_here', 'admin');
