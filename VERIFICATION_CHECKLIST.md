# MeDora - Verification Checklist

## ✅ Pre-Start Checklist

- [ ] Java 17+ installed (`java -version`)
- [ ] Node.js 16+ installed (`node -version`)
- [ ] Maven installed or using mvnw
- [ ] All dependencies installed (`npm install` in project and call-server folders)

## ✅ Backend Verification

### Start Backend
```bash
cd projectbackend
mvnw.cmd spring-boot:run
```

### Check Console Output
- [ ] See "=== Starting Data Initialization ==="
- [ ] See "Created patient: patient1@teleasha.com"
- [ ] See "Created doctor: dr.sharma@teleasha.com"
- [ ] See "Created pharmacy: pharmacy@teleasha.com"
- [ ] See "Created admin: admin@teleasha.com"
- [ ] See "=== Data Initialization Complete ==="
- [ ] See "Total users in database: 4"
- [ ] No red ERROR messages

### Test Endpoints
- [ ] http://localhost:8080/api/auth/test-db returns `{"userCount":4}`
- [ ] http://localhost:8080/h2-console opens H2 database console

## ✅ Frontend Verification

### Start Frontend
```bash
cd project
npm run dev
```

### Check Console Output
- [ ] No errors during build
- [ ] See "Local: http://localhost:5173"
- [ ] No red ERROR messages

### Test Pages
- [ ] http://localhost:5173 - Landing page loads
- [ ] http://localhost:5173/login - Login page loads
- [ ] http://localhost:5173/signup - Signup page loads

## ✅ Authentication Testing

### Test Login
1. [ ] Go to http://localhost:5173/login
2. [ ] Click "Patient" quick login button
3. [ ] Click "Sign In"
4. [ ] Check browser console (F12) for "Login attempt for: patient1@teleasha.com"
5. [ ] Check backend console for "Login attempt for: patient1@teleasha.com"
6. [ ] Should redirect to /dashboard
7. [ ] Should see "Good Morning, Ramesh 👋"

### Test Signup
1. [ ] Go to http://localhost:5173/signup
2. [ ] Fill in: Name, Email, Password
3. [ ] Select role (Patient/Doctor/Pharmacy)
4. [ ] Click "Create Account"
5. [ ] Check browser console for "Registration attempt"
6. [ ] Check backend console for "Registration successful"
7. [ ] Should redirect to /dashboard

## ✅ Dashboard Pages Testing

### Patient Dashboard
- [ ] /dashboard - Main dashboard loads
- [ ] /patient/appointments - Appointments page loads
- [ ] /patient/prescriptions - Prescriptions page loads
- [ ] /patient/doctors - Doctors list loads
- [ ] /patient/pharmacy - Pharmacy finder loads

### Doctor Dashboard (Login as doctor)
- [ ] /dashboard - Doctor dashboard loads
- [ ] /doctor/patients - Patients page loads
- [ ] /doctor/prescriptions - Prescriptions management loads

### Pharmacy Dashboard (Login as pharmacy)
- [ ] /dashboard - Pharmacy dashboard loads
- [ ] /pharmacy/inventory - Inventory page loads
- [ ] /pharmacy/orders - Orders page loads

### Admin Dashboard (Login as admin)
- [ ] /dashboard - Admin dashboard loads
- [ ] /admin/users - Users management loads
- [ ] /admin/analytics - Analytics page loads

## ✅ Database Persistence Testing

1. [ ] Login with demo account
2. [ ] Stop backend (Ctrl+C)
3. [ ] Restart backend
4. [ ] Check console shows "Data already exists. Skipping initialization."
5. [ ] Login again - should work
6. [ ] Database persisted successfully!

## ✅ Call Server Verification

### Start Call Server
```bash
cd call-server
npm start
```

### Check Console Output
- [ ] See "Server running on port 5002"
- [ ] No errors

## 🐛 Troubleshooting

### Backend won't start
- [ ] Check Java version: `java -version` (need 17+)
- [ ] Check port 8080 is free
- [ ] Run: `mvnw.cmd clean install` first

### Frontend won't start
- [ ] Check Node version: `node -version` (need 16+)
- [ ] Run: `npm install` first
- [ ] Check port 5173 is free
- [ ] Delete node_modules and reinstall

### Login fails
- [ ] Backend is running
- [ ] Test endpoint works: http://localhost:8080/api/auth/test-db
- [ ] Check browser console (F12) for errors
- [ ] Check backend console for errors
- [ ] Try demo accounts exactly as shown

### Database empty
- [ ] Stop backend
- [ ] Check application.properties has `ddl-auto=update`
- [ ] Delete H2 database file if exists
- [ ] Restart backend
- [ ] Should see initialization messages

### Pages not found
- [ ] Check App.tsx has all routes
- [ ] Check file names match imports
- [ ] Restart frontend server

## ✅ Final Verification

- [ ] All 3 servers running
- [ ] Can login with all 4 demo accounts
- [ ] Can signup new user
- [ ] All dashboard pages accessible
- [ ] No console errors
- [ ] Database persists after restart

## 🎉 Success Criteria

✅ Backend running on port 8080
✅ Frontend running on port 5173
✅ Call server running on port 5002
✅ Can login with demo accounts
✅ Can signup new users
✅ All 10 new pages load correctly
✅ Database persists between restarts
✅ No critical errors in console

---

**If all checkboxes are checked, your application is working perfectly!**
