-- MeDora Database Setup Script
-- Run this in MySQL if auto-creation fails

-- Create database
CREATE DATABASE IF NOT EXISTS medora;
USE medora;

-- Show current database
SELECT DATABASE();

-- The application will auto-create tables, but if needed, you can verify:
SHOW TABLES;

-- After backend runs, verify data:
SELECT * FROM users;
SELECT COUNT(*) FROM users;

-- Useful queries:
-- View all users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Find specific user
SELECT * FROM users WHERE email = 'patient1@teleasha.com';

-- View all appointments
SELECT * FROM appointments;

-- View all prescriptions
SELECT * FROM prescriptions;

-- Clean up (CAREFUL - deletes all data!)
-- DROP DATABASE medora;
