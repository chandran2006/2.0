# 🚀 MeDora Quick Start Guide

## ⚠️ IMPORTANT: Start Services in This Order

### Step 1: Start Backend (MUST BE FIRST)
```bash
cd c:\Users\ganes\OneDrive\Desktop\2.0\projectbackend
mvnw clean install
mvnw spring-boot:run
```

**Wait for these messages in console:**
```
=== Starting Data Initialization ===
Created patient: patient1@teleasha.com
Created doctor: dr.sharma@teleasha.com
Created pharmacy: pharmacy@teleasha.com
Created admin: admin@teleasha.com
=== Data Initialization Complete ===
Total users in database: 4
```

**Backend is ready when you see:**
```
Started ProjectbackendApplication in X.XXX seconds
```

### Step 2: Verify Backend is Working
Open in browser: http://localhost:8080/api/auth/test-db

**Expected Response:**
```json
{
  "message": "Database connection successful",
  "userCount": 4
}
```

### Step 3: Start Frontend
Open a NEW terminal/command prompt:
```bash
cd c:\Users\ganes\OneDrive\Desktop\2.0\project
npm install
npm run dev
```

**Frontend is ready when you see:**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 4: Start Call Server (Optional for video calls)
Open a NEW terminal/command prompt:
```bash
cd c:\Users\ganes\OneDrive\Desktop\2.0\call-server
npm install
npm start
```

**Call server is ready when you see:**
```
Call server running on port 5002
```

## 🧪 Testing Login & Signup

### Option 1: Use the Test Page (Recommended)
1. Open `test-backend.html` in your browser
2. Click "Test Database" - should show 4 users
3. Click "Test Login" - should login successfully
4. Click "Test Register" - should create new user

### Option 2: Use the Frontend
1. Open http://localhost:5173/login
2. Click any "Quick login" button (Patient, Doctor, Pharmacy, Admin)
3. Click "Sign In"
4. Should redirect to dashboard

### Option 3: Test Signup
1. Open http://localhost:5173/signup
2. Fill in:
   - Name: Your Name
   - Email: yourname@example.com (must be unique)
   - Password: yourpassword
   - Role: Select PATIENT, DOCTOR, or PHARMACY
3. Click "Create Account"
4. Should redirect to dashboard

## 🔍 Troubleshooting

### Problem: "Unable to connect to server"
**Solution:**
1. Check if backend is running: `netstat -ano | findstr :8080`
2. If not running, start backend (Step 1)
3. Wait for "Started ProjectbackendApplication" message
4. Refresh frontend page

### Problem: "Registration failed: Email already registered"
**Solution:**
Use a different email address or delete the user from database:
1. Open http://localhost:8080/h2-console
2. Login with:
   - JDBC URL: jdbc:h2:mem:medora
   - Username: root
   - Password: Chandran@2006
3. Run: `DELETE FROM USERS WHERE EMAIL = 'yourname@example.com';`
4. Try registration again

### Problem: "Invalid credentials" for demo accounts
**Solution:**
1. Stop backend (Ctrl+C)
2. Restart backend - it will recreate demo accounts
3. Try login again with:
   - patient1@teleasha.com / password123
   - dr.sharma@teleasha.com / password123
   - pharmacy@teleasha.com / pharmacy123
   - admin@teleasha.com / admin123

### Problem: CORS errors in browser console
**Solution:**
1. Ensure frontend is running on http://localhost:5173
2. Ensure backend is running on http://localhost:8080
3. Restart both services
4. Clear browser cache (Ctrl+Shift+Delete)

### Problem: Frontend shows blank page
**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Ensure .env file exists in project folder with:
   ```
   VITE_API_URL=http://localhost:8080/api
   VITE_SOCKET_URL=http://localhost:5002
   ```
4. Restart frontend: `npm run dev`

## 📊 Verify Database

### Check H2 Console
1. Open http://localhost:8080/h2-console
2. Login with:
   - JDBC URL: jdbc:h2:mem:medora
   - Username: root
   - Password: Chandran@2006
3. Run queries:
   ```sql
   -- See all users
   SELECT * FROM USERS;
   
   -- Count users
   SELECT COUNT(*) FROM USERS;
   
   -- Check specific user
   SELECT * FROM USERS WHERE EMAIL = 'patient1@teleasha.com';
   ```

## 🎯 Demo Accounts

| Role     | Email                      | Password     |
|----------|----------------------------|--------------|
| Patient  | patient1@teleasha.com      | password123  |
| Doctor   | dr.sharma@teleasha.com     | password123  |
| Pharmacy | pharmacy@teleasha.com      | pharmacy123  |
| Admin    | admin@teleasha.com         | admin123     |

## 📝 Quick Commands

### Check if services are running:
```bash
# Run the check script
check-services.bat

# Or manually check ports:
netstat -ano | findstr :8080  # Backend
netstat -ano | findstr :5173  # Frontend
netstat -ano | findstr :5002  # Call Server
```

### Stop services:
- Press `Ctrl+C` in each terminal window

### Restart backend (if needed):
```bash
cd projectbackend
mvnw spring-boot:run
```

### Restart frontend (if needed):
```bash
cd project
npm run dev
```

## ✅ Success Indicators

### Backend Started Successfully:
- ✅ Console shows "Started ProjectbackendApplication"
- ✅ Console shows "Total users in database: 4"
- ✅ http://localhost:8080/api/auth/test-db returns JSON
- ✅ http://localhost:8080/h2-console is accessible

### Frontend Started Successfully:
- ✅ Console shows "Local: http://localhost:5173/"
- ✅ Browser opens to login page
- ✅ No CORS errors in browser console (F12)

### Login/Signup Working:
- ✅ Can login with demo accounts
- ✅ Can create new account
- ✅ Redirects to dashboard after login
- ✅ User data saved in localStorage
- ✅ Browser console shows "Login successful"

## 🆘 Still Having Issues?

1. **Check Backend Console** - Look for error messages
2. **Check Browser Console (F12)** - Look for network errors
3. **Verify Ports** - Make sure 8080, 5173, 5002 are not used by other apps
4. **Check Java Version** - Must be Java 17+: `java -version`
5. **Check Node Version** - Must be Node 16+: `node -version`
6. **Restart Everything** - Stop all services and start fresh

## 📞 Need Help?

Check the detailed guide: `TEST_LOGIN_SIGNUP.md`
