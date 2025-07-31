-- MediSlot Database Schema
-- Run this SQL to create the required database structure

CREATE DATABASE IF NOT EXISTS medislot_db;
USE medislot_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    bio TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(64),
    reset_token VARCHAR(64),
    reset_token_expires DATETIME,
    last_login DATETIME,
    email_verified_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    experience_years INT,
    consultation_fee DECIMAL(10,2),
    profile_picture VARCHAR(255),
    bio TEXT,
    address TEXT,
    available_days VARCHAR(50), -- JSON or comma-separated
    available_hours VARCHAR(50), -- JSON or comma-separated
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    symptoms TEXT,
    notes TEXT,
    consultation_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Contact messages table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email logs table (for tracking sent emails)
CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_type ENUM('verification', 'password_reset', 'appointment_confirmation', 'other') NOT NULL,
    status ENUM('sent', 'failed') NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample doctors
INSERT INTO doctors (name, email, phone, specialty, qualification, experience_years, consultation_fee, bio, address, available_days, available_hours) VALUES
('Dr. Ananya Sharma', 'ananya.sharma@medislot.com', '+91 12345 67890', 'Dermatology', 'MBBS, MD (Dermatology)', 8, 199.00, 'Experienced dermatologist specializing in skin care and cosmetic treatments.', '123, Shashtri Nagar, Jaipur', 'Monday,Tuesday,Wednesday,Thursday,Friday', '10:00-17:00'),
('Dr. Rajesh Kumar', 'rajesh.kumar@medislot.com', '+91 98765 43210', 'Cardiology', 'MBBS, MD (Cardiology)', 12, 299.00, 'Senior cardiologist with expertise in heart diseases and preventive cardiology.', '456, Medical Center, Delhi', 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', '09:00-18:00'),
('Dr. Priya Patel', 'priya.patel@medislot.com', '+91 87654 32109', 'Gynecology', 'MBBS, MS (Gynecology)', 10, 249.00, 'Women\'s health specialist providing comprehensive gynecological care.', '789, Women\'s Clinic, Mumbai', 'Monday,Tuesday,Wednesday,Thursday,Friday', '10:00-16:00'),
('Dr. Amit Singh', 'amit.singh@medislot.com', '+91 76543 21098', 'General Medicine', 'MBBS, MD (Internal Medicine)', 15, 149.00, 'General physician with extensive experience in family medicine and preventive care.', '321, Health Center, Chandigarh', 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', '08:00-20:00');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_active ON doctors(is_active);