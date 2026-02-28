# MeDora - Database & Authentication Fix Guide

## Issues Fixed

### 1. Database Persistence
- Changed `spring.jpa.hibernate.ddl-auto` from `create-drop` to `update`
- Database now persists between application restarts
- Added duplicate data prevention in DataInitializer

### 2. Authentication Logging
- Added detailed console logging for login/signup attempts
- Better error messages in frontend and backend
- Test endpoint added: `/api/auth/test-db`

### 3. New Pages Added
All dashboard elements now have dedicated pages:

#### Patient Pages
- `/patient/appointments` - View and manage appointments
- `/patient/prescriptions` - View prescriptions
- `/patient/doctors` - Find and book doctors
- `/patient/pharmacy` - Find nearby pharmacies

#### Doctor Pages
- `/doctor/patients` - Manage patients
- `/doctor/prescriptions` - Create and manage prescriptions

#### Pharmacy Pages
- `/pharmacy/inventory` - Manage medicine inventory
- `/pharmacy/orders` - Process prescription orders

#### Admin Pages
- `/admin/users` - User management
- `/admin/analytics` - System analytics and reports

## How to Start the Application

### Step 1: Start Backend
```bash
cd projectbackend
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

**Check console for:**
```
=== Starting Data Initialization ===
Created patient: patient1@teleasha.com
Created doctor: dr.sharma@teleasha.com
Created pharmacy: pharmacy@teleasha.com
Created admin: admin@teleasha.com
=== Data Initialization Complete ===
Total users in database: 4
```

### Step 2: Test Database (Optional)
Open browser: http://localhost:8080/api/auth/test-db

Should see: `{"message":"Database connection successful","userCount":4}`

### Step 3: Start Frontend
```bash
cd project
npm install
npm run dev
```

Frontend: http://localhost:5173

### Step 4: Start Call Server
```bash
cd call-server
npm install
npm start
```

Call server: http://localhost:5002

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | patient1@teleasha.com | password123 |
| Doctor | dr.sharma@teleasha.com | password123 |
| Pharmacy | pharmacy@teleasha.com | pharmacy123 |
| Admin | admin@teleasha.com | admin123 |

## Troubleshooting

### Login Not Working

1. **Check backend is running**
   - Open: http://localhost:8080/api/auth/test-db
   - Should show userCount: 4

2. **Check browser console (F12)**
   - Look for "Login attempt for: [email]"
   - Check for error messages

3. **Check backend console**
   - Look for "Login attempt for: [email]"
   - Look for "Login successful" or error messages

### Signup Not Working

1. **Check browser console**
   - Look for "Registration attempt for: [email]"
   - Check error messages

2. **Check backend console**
   - Look for "Registration attempt for: [email]"
   - Look for any SQL errors

### Database Reset

If you need to reset the database:

1. Stop the backend
2. Delete the H2 database file (usually in project root or temp folder)
3. Restart the backend - it will recreate with demo data

### H2 Console Access

URL: http://localhost:8080/h2-console

Settings:
- JDBC URL: `jdbc:h2:mem:medora`
- Username: `root`
- Password: `Chandran@2006`

## API Endpoints

### Test Endpoints
- GET `/api/auth/test-db` - Check database connection

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- GET `/api/auth/current-user/{id}` - Get user details

### Appointments
- GET `/api/appointments/doctors` - Get all doctors
- POST `/api/appointments/book` - Book appointment
- GET `/api/appointments/patient/{id}` - Get patient appointments
- GET `/api/appointments/doctor/{id}` - Get doctor appointments

### Prescriptions
- POST `/api/prescriptions/create` - Create prescription
- GET `/api/prescriptions/patient/{id}` - Get patient prescriptions
- GET `/api/prescriptions/doctor/{id}` - Get doctor prescriptions

### Medicines
- GET `/api/medicines` - Get all medicines
- GET `/api/medicines/search?q={query}` - Search medicines
- POST `/api/medicines/create` - Add medicine

### Pharmacies
- GET `/api/pharmacies` - Get all pharmacies
- GET `/api/pharmacies/nearby?lat={lat}&lng={lng}` - Get nearby pharmacies

## Changes Made

### Backend Files Modified
1. `application.properties` - Changed ddl-auto to update
2. `DataInitializer.java` - Added logging and duplicate prevention
3. `AuthController.java` - Added logging and test endpoint
4. `UserService.java` - Added getUserCount method

### Frontend Files Created
1. Patient pages: AppointmentsPage, PrescriptionsPage, DoctorsPage, PharmacyPage
2. Doctor pages: PatientsPage, PrescriptionsManagePage
3. Pharmacy pages: InventoryPage, OrdersPage
4. Admin pages: UsersManagePage, AnalyticsPage

### Frontend Files Modified
1. `App.tsx` - Added all new routes
2. `AuthContext.tsx` - Added detailed logging

## Next Steps

1. Connect dashboard buttons to new pages
2. Implement actual API calls in all pages
3. Add form validation
4. Add loading states
5. Add error handling
6. Implement WebRTC video calls
7. Add real-time notifications

## Support

If issues persist:
1. Check all three servers are running
2. Check browser console (F12)
3. Check backend console
4. Verify database has data using H2 console
5. Try the test endpoint: http://localhost:8080/api/auth/test-db
