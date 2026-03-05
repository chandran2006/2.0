# MeDora - Complete System Verification Guide

## 🔍 System Overview

This guide verifies all features and functions in the MeDora telemedicine application.

---

## 📋 Pre-Verification Checklist

### Backend Requirements
- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] Backend running on `http://localhost:8080`

### Frontend Requirements
- [ ] Node.js 16+ installed
- [ ] npm installed
- [ ] Frontend running on `http://localhost:5173`

### Agora Requirements
- [ ] Agora App ID: `fec296083f304452b43d718b2aaa9d00`
- [ ] Agora Certificate: `60dd27c9f69d495f990f502a9268fa05`
- [ ] Agora project is ACTIVE

---

## 🚀 Start All Services

### Step 1: Start Backend
```bash
cd projectbackend
mvnw spring-boot:run
```
**Expected Output:**
```
🌐 MeDora Backend Server Started
📍 Local Access:    http://localhost:8080
📍 API Base:        http://localhost:8080/api
```

### Step 2: Start Frontend
```bash
cd project
npm install
npm run dev
```
**Expected Output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## ✅ Feature Verification

## 1. Authentication System

### Test 1.1: User Login
**Steps:**
1. Open `http://localhost:5173`
2. Click "Login"
3. Use credentials:
   - Patient: `patient1@teleasha.com` / `password123`
   - Doctor: `dr.sharma@teleasha.com` / `password123`
   - Pharmacy: `pharmacy@teleasha.com` / `pharmacy123`
   - Admin: `admin@teleasha.com` / `admin123`

**Expected Result:**
- ✅ Successful login
- ✅ Redirect to role-specific dashboard
- ✅ User name displayed in header

**API Endpoint:** `POST /api/auth/login`

### Test 1.2: User Registration
**Steps:**
1. Click "Sign Up"
2. Fill form with new user details
3. Select role (Patient/Doctor/Pharmacy)
4. Submit

**Expected Result:**
- ✅ Account created
- ✅ Redirect to login page
- ✅ Success message displayed

**API Endpoint:** `POST /api/auth/register`

---

## 2. Appointment System

### Test 2.1: Book Appointment (Patient)
**Steps:**
1. Login as Patient
2. Go to "Doctors" page
3. Click "Book" on any doctor
4. Fill appointment form
5. Submit

**Expected Result:**
- ✅ Appointment created with PENDING status
- ✅ Appears in patient's appointments list
- ✅ Success notification shown

**API Endpoint:** `POST /api/appointments/book`

### Test 2.2: View Appointments (Patient)
**Steps:**
1. Login as Patient
2. Go to "Appointments" page

**Expected Result:**
- ✅ List of all patient appointments
- ✅ Shows status badges (PENDING/APPROVED/REJECTED)
- ✅ Cancel button for PENDING appointments
- ✅ Join Call button for APPROVED appointments

**API Endpoint:** `GET /api/appointments/patient/{patientId}`

### Test 2.3: Approve Appointment (Doctor)
**Steps:**
1. Login as Doctor
2. Go to "Appointments" page
3. Click "Approve" on PENDING appointment

**Expected Result:**
- ✅ Status changes to APPROVED
- ✅ Success notification
- ✅ Patient can now join call

**API Endpoint:** `PUT /api/appointments/{id}/approve`

### Test 2.4: Reject Appointment (Doctor)
**Steps:**
1. Login as Doctor
2. Go to "Appointments" page
3. Click "Reject" on PENDING appointment
4. Confirm rejection

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Status changes to REJECTED
- ✅ Success notification

**API Endpoint:** `PUT /api/appointments/{id}/reject`

### Test 2.5: Cancel Appointment (Patient)
**Steps:**
1. Login as Patient
2. Go to "Appointments" page
3. Click "Cancel" on PENDING appointment
4. Confirm cancellation

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Appointment deleted
- ✅ Removed from list

**API Endpoint:** `DELETE /api/appointments/{id}`

---

## 3. Video Call System (Agora Integration)

### Test 3.1: Doctor Goes Online
**Steps:**
1. Login as Doctor
2. Go to "Consultation Requests" page
3. Toggle "Go Online" switch

**Expected Result:**
- ✅ Status changes to "Online"
- ✅ Green indicator shows
- ✅ Doctor appears in available doctors list

**API Endpoint:** `POST /api/calls/doctor/online`

### Test 3.2: Patient Initiates Call
**Steps:**
1. Login as Patient
2. Go to "Doctors" page
3. Find online doctor (green "Online Now" badge)
4. Click "Call Now" button

**Expected Result:**
- ✅ "Waiting for Doctor" modal appears
- ✅ Call request sent
- ✅ Polling starts (checks every 2 seconds)
- ✅ Cancel button available

**API Endpoint:** `POST /api/calls/initiate`

### Test 3.3: Doctor Receives Call Request
**Steps:**
1. Doctor should be on "Consultation Requests" page
2. Wait for call request to appear (auto-refresh every 3 seconds)

**Expected Result:**
- ✅ Call request card appears
- ✅ Shows "Patient Call Request"
- ✅ Accept and Reject buttons visible
- ✅ Timestamp displayed

**API Endpoint:** `GET /api/calls/incoming/{userId}`

### Test 3.4: Doctor Accepts Call
**Steps:**
1. Doctor clicks "Accept Call" button

**Expected Result:**
- ✅ Call status changes to ACCEPTED
- ✅ Doctor navigates to video call room
- ✅ Patient automatically navigates to video call room
- ✅ Both see "Connecting..." message

**API Endpoint:** `PUT /api/calls/{id}/accept`

### Test 3.5: Video Call Room - Full Screen
**Steps:**
1. Both users should be in video call room

**Expected Result:**
- ✅ Full screen video interface (not semi-screen)
- ✅ Local video in bottom-right corner
- ✅ Remote video takes full screen
- ✅ Connection status indicator at top
- ✅ Network quality indicators visible

### Test 3.6: Video Call Controls
**Steps:**
1. Test each control button

**Expected Result:**
- ✅ **Mute Button**: Toggles microphone on/off
- ✅ **Video Button**: Toggles camera on/off
- ✅ **End Call Button**: Ends call and returns to dashboard
- ✅ No reject button (removed as requested)

### Test 3.7: Agora Token Generation
**Steps:**
1. Open browser console (F12)
2. Check logs during call join

**Expected Result:**
```
=== Agora Join Debug ===
Channel: call-123
User ID: 1
Role: doctor/patient
Token provided: true
App ID being used: fec296083f304452b43d718b2aaa9d00
✓ Successfully joined channel
✓ Got media tracks - Audio: true Video: true
✓ Playing local video
✓ Published tracks
```

**API Endpoint:** `GET /api/agora/token`

### Test 3.8: Remote Video Display
**Steps:**
1. Both users in call
2. Check if remote video appears

**Expected Result:**
- ✅ Remote user video visible
- ✅ Remote user name displayed
- ✅ Audio playing
- ✅ Video smooth (no lag)

### Test 3.9: Call End
**Steps:**
1. Either user clicks "End Call" button

**Expected Result:**
- ✅ Call ends for both users
- ✅ Both return to dashboard
- ✅ Call status updated to ENDED
- ✅ Tracks properly closed

**API Endpoint:** `PUT /api/calls/{id}/end`

### Test 3.10: Doctor Rejects Call
**Steps:**
1. Patient initiates call
2. Doctor clicks "Reject" button
3. Confirm rejection

**Expected Result:**
- ✅ Call status changes to REJECTED
- ✅ Patient sees "Call Rejected" notification
- ✅ Patient returns to doctors page
- ✅ Doctor stays on consultation requests page

**API Endpoint:** `PUT /api/calls/{id}/reject`

### Test 3.11: Patient Cancels Call Request
**Steps:**
1. Patient initiates call
2. While waiting, click "Cancel Request"

**Expected Result:**
- ✅ Call status changes to REJECTED
- ✅ Waiting modal closes
- ✅ Patient returns to doctors page
- ✅ Success notification shown

---

## 4. Prescription System

### Test 4.1: Create Prescription (Doctor)
**Steps:**
1. Login as Doctor
2. Go to "Prescriptions" page
3. Click "Create Prescription"
4. Fill form with patient details and medicines
5. Submit

**Expected Result:**
- ✅ Prescription created
- ✅ Appears in doctor's prescription list
- ✅ Patient can view it

**API Endpoint:** `POST /api/prescriptions/create`

### Test 4.2: View Prescriptions (Patient)
**Steps:**
1. Login as Patient
2. Go to "Prescriptions" page

**Expected Result:**
- ✅ List of all prescriptions
- ✅ Shows doctor name
- ✅ Shows medicines
- ✅ Shows status

**API Endpoint:** `GET /api/prescriptions/patient/{patientId}`

---

## 5. Medicine System

### Test 5.1: Search Medicines
**Steps:**
1. Login as any user
2. Go to "Medicines" page
3. Type medicine name in search box

**Expected Result:**
- ✅ Filtered results appear
- ✅ Shows medicine details
- ✅ Shows price and availability

**API Endpoint:** `GET /api/medicines/search?q={query}`

### Test 5.2: Add Medicine (Pharmacy)
**Steps:**
1. Login as Pharmacy
2. Go to "Medicines" page
3. Click "Add Medicine"
4. Fill form
5. Submit

**Expected Result:**
- ✅ Medicine added
- ✅ Appears in medicine list
- ✅ Success notification

**API Endpoint:** `POST /api/medicines/create`

---

## 6. Pharmacy System

### Test 6.1: View Pharmacies
**Steps:**
1. Login as Patient
2. Go to "Pharmacy" page

**Expected Result:**
- ✅ List of pharmacies
- ✅ Shows location
- ✅ Shows contact info

**API Endpoint:** `GET /api/pharmacies`

---

## 7. Health Records

### Test 7.1: View Health Records (Patient)
**Steps:**
1. Login as Patient
2. Go to "Health Records" page

**Expected Result:**
- ✅ List of health records
- ✅ Shows date and details
- ✅ Can add new records

**API Endpoint:** `GET /api/health-records/patient/{patientId}`

---

## 🔧 Troubleshooting

### Issue 1: Backend Not Starting
**Symptoms:**
- Port 8080 already in use
- Java errors

**Solutions:**
```bash
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

### Issue 2: Frontend Not Starting
**Symptoms:**
- Port 5173 already in use
- npm errors

**Solutions:**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Agora Call Not Working
**Symptoms:**
- "Invalid vendor key" error
- Can't join channel
- No video/audio

**Solutions:**
1. Verify Agora credentials in:
   - `projectbackend/src/main/resources/application.properties`
   - `project/.env`

2. Check Agora Console:
   - Login to https://console.agora.io/
   - Verify project is ACTIVE
   - Check App ID and Certificate

3. Test token generation:
```bash
curl "http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor"
```

4. Clear browser cache (Ctrl+Shift+Delete)

5. Check browser console for errors (F12)

### Issue 4: Call Request Not Appearing
**Symptoms:**
- Doctor doesn't see call request
- Patient stuck on waiting screen

**Solutions:**
1. Ensure doctor is online (toggle switch)
2. Check backend logs for errors
3. Verify polling is working (check network tab)
4. Restart both frontend and backend

### Issue 5: Video Not Full Screen
**Symptoms:**
- Video appears in small window
- Not covering entire screen

**Solutions:**
- Already fixed in VideoCall.tsx
- Clear browser cache
- Hard refresh (Ctrl+F5)

---

## 📊 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Appointments
- `GET /api/appointments/doctors` - Get all doctors
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/patient/{id}` - Get patient appointments
- `GET /api/appointments/doctor/{id}` - Get doctor appointments
- `PUT /api/appointments/{id}/approve` - Approve appointment
- `PUT /api/appointments/{id}/reject` - Reject appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

### Calls
- `POST /api/calls/initiate` - Initiate call
- `GET /api/calls/{id}` - Get call status
- `PUT /api/calls/{id}/accept` - Accept call
- `PUT /api/calls/{id}/reject` - Reject call
- `PUT /api/calls/{id}/end` - End call
- `GET /api/calls/incoming/{userId}` - Get incoming calls
- `POST /api/calls/doctor/online` - Doctor goes online
- `POST /api/calls/doctor/offline` - Doctor goes offline
- `GET /api/calls/doctors/available` - Get available doctors

### Agora
- `GET /api/agora/token` - Generate Agora token

### Prescriptions
- `POST /api/prescriptions/create` - Create prescription
- `GET /api/prescriptions/patient/{id}` - Get patient prescriptions
- `GET /api/prescriptions/doctor/{id}` - Get doctor prescriptions

### Medicines
- `GET /api/medicines/search?q={query}` - Search medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines/create` - Add medicine

### Pharmacies
- `GET /api/pharmacies` - Get all pharmacies

### Health Records
- `GET /api/health-records/patient/{id}` - Get patient health records
- `POST /api/health-records` - Create health record

---

## ✅ Final Verification Checklist

### Core Features
- [ ] User login/registration works
- [ ] Patient can book appointments
- [ ] Doctor can approve/reject appointments
- [ ] Patient can cancel pending appointments
- [ ] Doctor can go online/offline

### Video Call Features
- [ ] Patient can initiate call to online doctor
- [ ] Patient sees "Waiting for Doctor" modal
- [ ] Doctor receives call request
- [ ] Doctor can accept call
- [ ] Doctor can reject call
- [ ] Both users enter video room after acceptance
- [ ] Video call is full screen
- [ ] Local video shows in bottom-right
- [ ] Remote video shows full screen
- [ ] Mute button works
- [ ] Video toggle works
- [ ] End call button works
- [ ] No reject button in call room
- [ ] Network quality indicators show
- [ ] Call ends properly for both users

### Agora Integration
- [ ] Agora App ID configured
- [ ] Agora Certificate configured
- [ ] Token generation works
- [ ] Can join Agora channel
- [ ] Video tracks publish
- [ ] Audio tracks publish
- [ ] Remote video displays
- [ ] Remote audio plays

### Other Features
- [ ] Prescriptions work
- [ ] Medicine search works
- [ ] Pharmacy list works
- [ ] Health records work

---

## 🎯 Test Scenarios

### Scenario 1: Complete Call Flow
1. Doctor logs in and goes online
2. Patient logs in and sees online doctor
3. Patient clicks "Call Now"
4. Patient sees waiting modal
5. Doctor sees call request
6. Doctor clicks "Accept Call"
7. Both enter video room
8. Both see each other's video
9. Test mute/video controls
10. Either user ends call
11. Both return to dashboard

**Expected Duration:** 2-3 minutes
**Success Criteria:** All steps complete without errors

### Scenario 2: Call Rejection Flow
1. Doctor logs in and goes online
2. Patient initiates call
3. Doctor clicks "Reject"
4. Patient sees rejection notification
5. Patient returns to doctors page

**Expected Duration:** 30 seconds
**Success Criteria:** Clean rejection with proper notifications

### Scenario 3: Appointment Flow
1. Patient books appointment
2. Doctor approves appointment
3. Patient sees approved status
4. Patient can join call from appointment

**Expected Duration:** 1-2 minutes
**Success Criteria:** Appointment status updates correctly

---

## 📝 Notes

- All call requests use polling (2-second intervals)
- Doctor consultation requests auto-refresh (3-second intervals)
- Video call is full screen (fixed inset-0 with z-50)
- No reject button in video call room (removed)
- Patient cannot cancel approved appointments (removed)
- Agora tokens expire after 24 hours (default)

---

## 🆘 Support

If any feature is not working:

1. Check backend console for errors
2. Check frontend console (F12) for errors
3. Verify all services are running
4. Check API endpoints with curl/Postman
5. Clear browser cache
6. Restart both servers

For Agora-specific issues, see: `VERIFY_AGORA_CREDENTIALS.md`

---

## ✨ Summary

This verification guide covers:
- ✅ All authentication features
- ✅ Complete appointment system
- ✅ Full video call flow with Agora
- ✅ Call request/accept/reject flow
- ✅ Prescription management
- ✅ Medicine search
- ✅ Pharmacy listings
- ✅ Health records

**Total Features Tested:** 30+
**Total API Endpoints:** 25+
**Estimated Test Time:** 15-20 minutes

---

**Last Updated:** 2024
**Version:** 2.0
**Status:** Production Ready ✅
