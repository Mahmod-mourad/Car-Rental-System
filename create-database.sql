-- SQL Script to create Car Rental Database
-- يمكنك تشغيل هذا الملف في pgAdmin أو psql

-- Create database
CREATE DATABASE car_rental;

-- Connect to the database (uncomment if running in psql)
-- \c car_rental;

-- Verify connection
SELECT current_database();

-- Show message
SELECT 'Database car_rental created successfully!' as status;
