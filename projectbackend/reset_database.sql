-- Reset MeDora Database
-- Run this in MySQL Workbench or command line: mysql -u root -p < reset_database.sql

USE medora;

-- Drop all tables to start fresh
DROP TABLE IF EXISTS health_records;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS calls;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS pharmacies;
DROP TABLE IF EXISTS doctor_availability;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS users;

-- The application will recreate tables on next startup
-- Then DataInitializer will populate demo accounts

SELECT 'Database reset complete. Restart the Spring Boot application.' AS message;
