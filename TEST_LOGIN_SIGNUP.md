# Login & Signup Testing Guide

## Current Configuration Status ✅

### Backend Configuration
- **Database**: H2 in-memory database (jdbc:h2:mem:medora)
- **Port**: 8080
- **CORS**: Enabled for http://localhost:5173
- **Security**: Disabled (all endpoints permit all)
- **Password Encoding**: BCrypt

### Frontend Configuration
- **API URL**: http://localhost:8080/api
- **Port**: 5173
- **CORS**: Enabled with credentials

### Database Initialization
- Demo accounts are auto-created on startup
- Patient: patient1@teleasha.com / password123
- Doctor: dr.sharma@teleasha.com / password123
- Pharmacy: pharmacy@teleasha.com / pharmacy123
- Admin: admin@teleasha.com / admin123

## Testing Steps

### Step 1: Start Backend
```bash
cd projectbackend
mvnw clean install
mvnw spring-boot:run
```

**Expected Output:**
- Server starts on port 8080
- Console shows: "=== Starting Data Initialization ==="
- Console shows: "Created patient: patient1@teleasha.com"
- Console shows: "Total users in database: 4"

### Step 2: Verify Backend is Running
Open browser: http://localhost:8080/api/auth/test-db

**Expected Response:**
```json
{
  "message": "Database connection successful",
  "userCount": 4
}
```

### Step 3: Check H2 Database Console
Open browser: http://localhost:8080/h2-console

**Connection Details:**
- JDBC URL: jdbc:h2:mem:medora
- Username: root
- Password: Chandran@2006

**Run SQL Query:**
```sql
SELECT * FROM USERS;
```

You should see 4 users with encrypted passwords.

### Step 4: Start Frontend
```bash
cd project
npm install
npm run dev
```

**Expected Output:**
- Vite dev server starts on http://localhost:5173

### Step 5: Test Login
1. Open http://localhost:5173/login
2. Click "Patient" quick login button (or manually enter credentials)
3. Click "Sign In"

**Check Browser Console (F12):**
- Should see: "Attempting login for: patient1@teleasha.com"
- Should see: "Login response: {user: {...}, message: 'Login successful'}"
- Should redirect to /dashboard

### Step 6: Test Signup
1. Open http://localhost:5173/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: PATIENT
3. Click "Create Account"

**Check Browser Console (F12):**
- Should see: "Attempting registration for: test@example.com as PATIENT"
- Should see: "Registration response: {user: {...}, message: 'Registration successful'}"
- Should redirect to /dashboard

## Common Issues & Solutions

### Issue 1: "Unable to connect to server"
**Cause:** Backend not running or wrong port
**Solution:**
1. Check if backend is running: `netstat -ano | findstr :8080`
2. Restart backend: `cd projectbackend && mvnw spring-boot:run`
3. Check console for errors

### Issue 2: "Invalid credentials" for demo accounts
**Cause:** Database not initialized or passwords don't match
**Solution:**
1. Stop backend
2. Delete H2 database files (if any)
3. Restart backend - it will recreate demo accounts
4. Check console for "Data Initialization Complete"

### Issue 3: CORS errors in browser console
**Cause:** Frontend running on wrong port or CORS misconfigured
**Solution:**
1. Ensure frontend is on http://localhost:5173
2. Check backend CorsConfig.java includes "http://localhost:5173"
3. Restart both servers

### Issue 4: Registration fails with 500 error
**Cause:** Missing required fields or database constraint violation
**Solution:**
1. Check backend console for error details
2. Ensure email is unique (not already registered)
3. Verify all required fields are filled

### Issue 5: Login works but signup doesn't
**Cause:** Email already exists in database
**Solution:**
1. Use a different email address
2. Or check H2 console and delete the user:
   ```sql
   DELETE FROM USERS WHERE EMAIL = 'test@example.com';
   ```

## API Endpoint Testing (Using curl or Postman)

### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"role\":\"PATIENT\"}"
```

**Expected Response:**
```json
{
  "user": {
    "id": 5,
    "email": "test@example.com",
    "name": "Test User",
    "role": "PATIENT"
  },
  "message": "Registration successful"
}
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"patient1@teleasha.com\",\"password\":\"password123\"}"
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "patient1@teleasha.com",
    "name": "Ramesh Kumar",
    "role": "PATIENT"
  },
  "message": "Login successful"
}
```

### Test Database Connection
```bash
curl http://localhost:8080/api/auth/test-db
```

**Expected Response:**
```json
{
  "message": "Database connection successful",
  "userCount": 4
}
```

## Debugging Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] H2 database accessible at /h2-console
- [ ] Demo accounts created (check console logs)
- [ ] CORS enabled for localhost:5173
- [ ] Browser console shows no CORS errors
- [ ] API calls reaching backend (check backend console)
- [ ] Passwords being encrypted with BCrypt
- [ ] User data saved to localStorage after login

## Next Steps After Successful Login/Signup

1. User should be redirected to /dashboard
2. User data should be in localStorage (key: 'teleasha_user')
3. AuthContext should have user object
4. Protected routes should be accessible

## Database Schema Verification

Run this in H2 Console to verify table structure:
```sql
SHOW COLUMNS FROM USERS;
```

Expected columns:
- ID (BIGINT)
- EMAIL (VARCHAR)
- PASSWORD (VARCHAR)
- NAME (VARCHAR)
- ROLE (VARCHAR)
- PHONE (VARCHAR)
- ADDRESS (VARCHAR)
- SPECIALIZATION (VARCHAR)
- LICENSE_NUMBER (VARCHAR)
- PHARMACY_NAME (VARCHAR)
- IS_AVAILABLE (BOOLEAN)
- CREATED_AT (TIMESTAMP)
- UPDATED_AT (TIMESTAMP)
