@echo off
echo Resetting MeDora Database...
echo.
echo Enter MySQL root password when prompted:
mysql -u root -p -e "USE medora; DROP TABLE IF EXISTS health_records, reports, prescriptions, appointments, calls, medicines, pharmacies, doctor_availability, system_settings, users; SELECT 'Database reset complete!' AS message;"
echo.
echo Database reset complete!
echo Now restart your Spring Boot application.
pause
