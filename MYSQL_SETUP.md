# 🔧 MySQL Database Setup Guide

## ⚠️ IMPORTANT: Database Configuration Changed

Your project was using **H2 in-memory database** which means:
- ❌ Data was stored in RAM only
- ❌ All data was lost when backend restarts
- ❌ No persistent storage

**Now configured to use MySQL:**
- ✅ Data persists permanently
- ✅ Survives backend restarts
- ✅ Professional production-ready database

## 📋 Prerequisites

You need MySQL installed on your computer. Choose one option:

### Option 1: MySQL Server (Recommended)
Download from: https://dev.mysql.com/downloads/mysql/

### Option 2: XAMPP (Easier for beginners)
Download from: https://www.apachefriends.org/

### Option 3: MySQL Workbench (GUI Tool)
Download from: https://dev.mysql.com/downloads/workbench/

## 🚀 Quick Setup Steps

### Step 1: Install MySQL

**If using XAMPP:**
1. Download and install XAMPP
2. Open XAMPP Control Panel
3. Start "MySQL" module
4. MySQL will run on port 3306

**If using MySQL Server:**
1. Download MySQL Installer
2. Install MySQL Server
3. Set root password: `Chandran@2006` (or change in application.properties)
4. Start MySQL service

### Step 2: Verify MySQL is Running

**Check if MySQL is running:**
```bash
# Windows
netstat -ano | findstr :3306

# Or check services
services.msc
# Look for "MySQL" or "MySQL80"
```

### Step 3: Create Database (Optional)

The application will auto-create the database, but you can create it manually:

**Using MySQL Command Line:**
```sql
mysql -u root -p
# Enter password: Chandran@2006

CREATE DATABASE medora;
USE medora;
SHOW TABLES;
```

**Using MySQL Workbench:**
1. Open MySQL Workbench
2. Connect to localhost
3. Run: `CREATE DATABASE medora;`

**Using phpMyAdmin (XAMPP):**
1. Open http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `medora`
4. Click "Create"

### Step 4: Update Password (If Different)

If your MySQL root password is different, update `application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 5: Start Backend

```bash
cd projectbackend
mvnw clean install
mvnw spring-boot:run
```

**Expected Output:**
```
Hibernate: create table users (...)
=== Starting Data Initialization ===
Created patient: patient1@teleasha.com
Created doctor: dr.sharma@teleasha.com
Created pharmacy: pharmacy@teleasha.com
Created admin: admin@teleasha.com
=== Data Initialization Complete ===
Total users in database: 4
```

## 🔍 Verify Data is Stored

### Option 1: MySQL Command Line
```sql
mysql -u root -p
USE medora;
SELECT * FROM users;
SELECT COUNT(*) FROM users;
```

### Option 2: MySQL Workbench
1. Open MySQL Workbench
2. Connect to localhost
3. Select `medora` database
4. Run: `SELECT * FROM users;`

### Option 3: phpMyAdmin (XAMPP)
1. Open http://localhost/phpmyadmin
2. Click `medora` database
3. Click `users` table
4. View data

## 📊 Database Configuration Details

**Current Configuration:**
```properties
Database: medora
Host: localhost
Port: 3306
Username: root
Password: Chandran@2006
Driver: MySQL 8.0+
```

**Connection URL:**
```
jdbc:mysql://localhost:3306/medora?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

**Features:**
- `createDatabaseIfNotExist=true` - Auto-creates database
- `useSSL=false` - Disables SSL for local development
- `allowPublicKeyRetrieval=true` - Allows password authentication
- `serverTimezone=UTC` - Sets timezone

## 🗄️ Database Tables

The application will auto-create these tables:

1. **users** - All user accounts (patients, doctors, pharmacies, admin)
2. **appointments** - Appointment records
3. **prescriptions** - Prescription records
4. **medicines** - Medicine inventory
5. **pharmacies** - Pharmacy information
6. **calls** - Call history
7. **health_records** - Patient health records
8. **reports** - Medical reports
9. **doctor_availability** - Doctor availability schedule

## ⚠️ Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution 1: Update Password**
```properties
# In application.properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

**Solution 2: Reset MySQL Root Password**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Chandran@2006';
FLUSH PRIVILEGES;
```

### Error: "Communications link failure"

**Cause:** MySQL is not running

**Solution:**
- Start MySQL service
- Check if port 3306 is available
- Verify MySQL is installed

**Windows:**
```bash
# Start MySQL service
net start MySQL80

# Or use services.msc
services.msc
# Find MySQL, right-click, Start
```

**XAMPP:**
- Open XAMPP Control Panel
- Click "Start" next to MySQL

### Error: "Unknown database 'medora'"

**Cause:** Database not created

**Solution:**
The app should auto-create it, but if not:
```sql
CREATE DATABASE medora;
```

### Error: "Table 'medora.users' doesn't exist"

**Cause:** Tables not created

**Solution:**
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Restart backend - it will create tables
- Check backend console for errors

### Error: "Public Key Retrieval is not allowed"

**Solution:** Already fixed in connection URL with `allowPublicKeyRetrieval=true`

If still occurs, update:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medora?allowPublicKeyRetrieval=true
```

## 🔄 Switching Between H2 and MySQL

### Use H2 (In-Memory - for testing):
```properties
spring.datasource.url=jdbc:h2:mem:medora
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

### Use MySQL (Persistent - for production):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medora?createDatabaseIfNotExist=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

## 📝 Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Use medora database
USE medora;

-- Show all tables
SHOW TABLES;

-- View users
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;

-- View specific user
SELECT * FROM users WHERE email = 'patient1@teleasha.com';

-- Delete all data (careful!)
DELETE FROM users;

-- Drop database (careful!)
DROP DATABASE medora;

-- Create database
CREATE DATABASE medora;

-- Show table structure
DESCRIBE users;
```

## 🎯 Verification Checklist

- [ ] MySQL installed and running
- [ ] MySQL service started (port 3306)
- [ ] Root password is correct
- [ ] Backend starts without errors
- [ ] Console shows "Data Initialization Complete"
- [ ] Can query database and see 4 users
- [ ] Data persists after backend restart
- [ ] Login/signup works and saves to database

## 🔐 Security Notes

**For Development:**
- Current setup is fine for local development
- Password in application.properties is acceptable

**For Production:**
- Use environment variables for password
- Enable SSL
- Create separate database user (not root)
- Use strong passwords
- Enable MySQL security features

**Example Production Config:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medora?useSSL=true
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

## 📞 Need Help?

If MySQL setup fails:
1. Check if MySQL is installed: `mysql --version`
2. Check if MySQL is running: `netstat -ano | findstr :3306`
3. Try connecting manually: `mysql -u root -p`
4. Check MySQL error logs
5. Restart MySQL service

## 🎉 Success Indicators

When everything works:
- ✅ Backend starts without database errors
- ✅ Console shows table creation SQL
- ✅ Console shows "Total users in database: 4"
- ✅ Can query MySQL and see data
- ✅ Data persists after backend restart
- ✅ Login/signup saves to database permanently

---

**Current Status:** ✅ Configured to use MySQL
**Database:** medora
**Host:** localhost:3306
**Username:** root
**Password:** Chandran@2006
