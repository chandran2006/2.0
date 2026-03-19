-- Update existing user emails from @teleasha.com to @medora.com
UPDATE users SET email = 'patient1@medora.com' WHERE email = 'patient1@teleasha.com';
UPDATE users SET email = 'dr.sharma@medora.com' WHERE email = 'dr.sharma@teleasha.com';
UPDATE users SET email = 'pharmacy@medora.com' WHERE email = 'pharmacy@teleasha.com';
UPDATE users SET email = 'admin@medora.com' WHERE email = 'admin@teleasha.com';

-- Verify the updates
SELECT id, email, name, role FROM users;
