# 🔌 Database Connectivity Verification Guide

## ✅ Database Configuration

### Backend Configuration (application.properties)
```properties
# H2 In-Memory Database
spring.datasource.url=jdbc:h2:mem:medora
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=root
spring.datasource.password=Chandran@2006

# JPA Settings
spring.jpa.hibernate.ddl-auto=update  ✅ Persistent mode
spring.jpa.show-sql=true              ✅ SQL logging enabled
spring.h2.console.enabled=true        ✅ H2 Console enabled
```

## 🧪 How to Test Database Connection

### Method 1: Quick Test Script
```bash
# Run the test script
TEST_DATABASE.bat
```

### Method 2: Manual Testing

#### Step 1: Start Backend
```bash
cd projectbackend
mvnw.cmd spring-boot:run
```

**Look for these messages in console:**
```
✅ Started ProjectbackendApplication
✅ H2 console available at '/h2-console'
✅ === Starting Data Initialization ===
✅ Created patient: patient1@teleasha.com
✅ Created doctor: dr.sharma@teleasha.com
✅ Total users in database: 4
```

#### Step 2: Test API Endpoint
```bash
# Open browser or use curl
http://localhost:8080/api/auth/test-db
```

**Expected Response:**
```json
{
  "message": "Database connection successful",
  "userCount": 4
}
```

#### Step 3: Access H2 Console
```
URL: http://localhost:8080/h2-console

Settings:
- JDBC URL: jdbc:h2:mem:medora
- Username: root
- Password: Chandran@2006
```

**Click "Connect" button**

#### Step 4: Run SQL Queries
```sql
-- Check all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES;

-- Check users
SELECT * FROM USERS;

-- Check appointments
SELECT * FROM APPOINTMENTS;

-- Check prescriptions
SELECT * FROM PRESCRIPTIONS;

-- Check medicines
SELECT * FROM MEDICINES;
```

## 🔍 Verification Checklist

### Backend Connectivity
- [ ] Backend starts without errors
- [ ] Port 8080 is accessible
- [ ] H2 console loads at /h2-console
- [ ] Test endpoint returns userCount
- [ ] SQL queries visible in console (if show-sql=true)

### Database Tables
- [ ] USERS table exists
- [ ] APPOINTMENTS table exists
- [ ] PRESCRIPTIONS table exists
- [ ] MEDICINES table exists
- [ ] PHARMACIES table exists
- [ ] HEALTH_RECORDS table exists
- [ ] CALLS table exists

### Data Initialization
- [ ] 4 demo users created
- [ ] Patient account exists
- [ ] Doctor account exists
- [ ] Pharmacy account exists
- [ ] Admin account exists
- [ ] Sample medicines loaded
- [ ] Sample pharmacy created

### Frontend-Backend Connection
- [ ] Frontend can call /api/auth/login
- [ ] Frontend can call /api/auth/register
- [ ] Frontend can call /api/appointments/*
- [ ] Frontend can call /api/prescriptions/*
- [ ] Frontend can call /api/medicines/*

## 🐛 Troubleshooting

### Issue: Backend won't start
**Solution:**
```bash
# Clean and rebuild
cd projectbackend
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

### Issue: Database empty
**Solution:**
1. Check console for "Data Initialization" messages
2. Verify DataInitializer.java is running
3. Check ddl-auto is set to "update" not "create-drop"

### Issue: H2 Console won't connect
**Solution:**
1. Verify JDBC URL: `jdbc:h2:mem:medora`
2. Check username: `root`
3. Check password: `Chandran@2006`
4. Ensure backend is running

### Issue: Frontend can't connect
**Solution:**
1. Check CORS settings in application.properties
2. Verify frontend API URL: `http://localhost:8080/api`
3. Check browser console for errors
4. Verify backend is running on port 8080

## 📊 Database Schema

### USERS Table
```sql
CREATE TABLE USERS (
    ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    NAME VARCHAR(255),
    ROLE VARCHAR(50),
    PHONE VARCHAR(50),
    ADDRESS VARCHAR(255),
    SPECIALIZATION VARCHAR(255),
    LICENSE_NUMBER VARCHAR(255),
    PHARMACY_NAME VARCHAR(255),
    IS_AVAILABLE BOOLEAN,
    CREATED_AT TIMESTAMP,
    UPDATED_AT TIMESTAMP
);
```

### APPOINTMENTS Table
```sql
CREATE TABLE APPOINTMENTS (
    ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    PATIENT_ID BIGINT,
    DOCTOR_ID BIGINT,
    APPOINTMENT_DATE TIMESTAMP,
    STATUS VARCHAR(50),
    SYMPTOMS TEXT,
    CONSULTATION_TYPE VARCHAR(50),
    CREATED_AT TIMESTAMP
);
```

### PRESCRIPTIONS Table
```sql
CREATE TABLE PRESCRIPTIONS (
    ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    PATIENT_ID BIGINT,
    DOCTOR_ID BIGINT,
    MEDICINE_NAME VARCHAR(255),
    DOSAGE VARCHAR(100),
    DURATION VARCHAR(100),
    INSTRUCTIONS TEXT,
    STATUS VARCHAR(50),
    CREATED_AT TIMESTAMP
);
```

### MEDICINES Table
```sql
CREATE TABLE MEDICINES (
    ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(255),
    GENERIC_NAME VARCHAR(255),
    MANUFACTURER VARCHAR(255),
    DOSAGE_FORM VARCHAR(100),
    DOSAGE_STRENGTH VARCHAR(100),
    PRICE DOUBLE,
    AVAILABILITY BOOLEAN,
    PHARMACY_ID BIGINT,
    STOCK_LEVEL INTEGER,
    SIDE_EFFECTS TEXT,
    DESCRIPTION TEXT
);
```

## 🎯 Connection Flow

```
Frontend (React)
    ↓
    HTTP Request (Axios)
    ↓
Backend (Spring Boot :8080)
    ↓
    JPA/Hibernate
    ↓
H2 Database (In-Memory)
```

## ✅ Success Indicators

### Console Output
```
✅ HikariPool-1 - Starting...
✅ HikariPool-1 - Start completed
✅ H2 console available at '/h2-console'
✅ Started ProjectbackendApplication in X seconds
✅ === Data Initialization Complete ===
✅ Total users in database: 4
```

### API Response
```json
{
  "message": "Database connection successful",
  "userCount": 4
}
```

### H2 Console
```
✅ Connection successful
✅ Tables visible in left panel
✅ Can run SELECT queries
✅ Data visible in results
```

## 🔐 Database Credentials

| Property | Value |
|----------|-------|
| JDBC URL | jdbc:h2:mem:medora |
| Driver | org.h2.Driver |
| Username | root |
| Password | Chandran@2006 |
| Console URL | http://localhost:8080/h2-console |
| API Test | http://localhost:8080/api/auth/test-db |

## 📝 Quick Commands

```bash
# Start backend
cd projectbackend && mvnw.cmd spring-boot:run

# Test database
curl http://localhost:8080/api/auth/test-db

# Open H2 Console
start http://localhost:8080/h2-console

# Test login
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"patient1@teleasha.com\",\"password\":\"password123\"}"
```

## 🎉 Verification Complete

If all checks pass:
- ✅ Database is connected
- ✅ Tables are created
- ✅ Data is initialized
- ✅ API endpoints work
- ✅ Frontend can communicate
- ✅ H2 Console accessible

**Your database is fully connected and operational!** 🚀
