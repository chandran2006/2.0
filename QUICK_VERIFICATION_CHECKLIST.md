# MeDora - Quick Verification Checklist

## 🚀 Quick Start

### 1. Start Backend
```bash
cd projectbackend
mvnw spring-boot:run
```
✅ Should see: "🌐 MeDora Backend Server Started"

### 2. Start Frontend
```bash
cd project
npm run dev
```
✅ Should see: "Local: http://localhost:5173/"

### 3. Run API Tests
```bash
TEST_ALL_APIS.bat
```
✅ All tests should PASS

---

## ✅ Core Features Checklist

### Authentication ✓
- [ ] Login with patient account works
- [ ] Login with doctor account works
- [ ] Registration creates new account
- [ ] Logout works properly

### Appointments ✓
- [ ] Patient can book appointment
- [ ] Doctor can see appointments
- [ ] Doctor can approve appointment
- [ ] Doctor can reject appointment (with confirmation)
- [ ] Patient can cancel PENDING appointment (with confirmation)
- [ ] Patient CANNOT cancel APPROVED appointment ✓

### Video Call System ✓
- [ ] Doctor can toggle online/offline status
- [ ] Online doctors show green "Online Now" badge
- [ ] Patient can click "Call Now" on online doctor
- [ ] Patient sees "Waiting for Doctor" modal
- [ ] Patient can cancel call request while waiting
- [ ] Doctor sees call request in "Consultation Requests"
- [ ] Doctor can accept call request
- [ ] Doctor can reject call request
- [ ] Both users enter video room ONLY after doctor accepts ✓
- [ ] Video call is FULL SCREEN (not semi-screen) ✓
- [ ] Local video shows in bottom-right corner
- [ ] Remote video takes full screen
- [ ] Mute button toggles microphone
- [ ] Video button toggles camera
- [ ] End call button works for both users
- [ ] NO reject button in call room ✓
- [ ] Network quality indicators show
- [ ] Connection status shows at top

### Agora Integration ✓
- [ ] Agora App ID: `fec296083f304452b43d718b2aaa9d00`
- [ ] Agora Certificate configured
- [ ] Token generation works
- [ ] Can join Agora channel
- [ ] Video publishes successfully
- [ ] Audio publishes successfully
- [ ] Remote video displays
- [ ] Remote audio plays
- [ ] No "invalid vendor key" error

### Other Features ✓
- [ ] Prescriptions can be created
- [ ] Prescriptions can be viewed
- [ ] Medicine search works
- [ ] Pharmacy list displays
- [ ] Health records accessible

---

## 🎯 Critical Test Scenarios

### Scenario 1: Complete Call Flow (MUST WORK)
```
1. Doctor Login → Go Online
2. Patient Login → Find Doctor → Call Now
3. Patient sees "Waiting for Doctor" modal
4. Doctor sees call request
5. Doctor clicks "Accept Call"
6. Both enter FULL SCREEN video room
7. Both see each other's video
8. Test mute/video controls
9. Either clicks "End Call"
10. Both return to dashboard
```
**Status:** [ ] PASS / [ ] FAIL

### Scenario 2: Call Rejection (MUST WORK)
```
1. Doctor Online
2. Patient initiates call
3. Doctor clicks "Reject"
4. Patient sees "Call Rejected" notification
5. Patient returns to doctors page
```
**Status:** [ ] PASS / [ ] FAIL

### Scenario 3: Patient Cancels Request (MUST WORK)
```
1. Doctor Online
2. Patient initiates call
3. Patient clicks "Cancel Request" in waiting modal
4. Call cancelled
5. Patient returns to doctors page
```
**Status:** [ ] PASS / [ ] FAIL

---

## 🔧 Common Issues & Fixes

### Issue: Backend won't start
**Fix:**
```bash
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Frontend won't start
**Fix:**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Agora "invalid vendor key"
**Fix:**
1. Check `projectbackend/src/main/resources/application.properties`
2. Check `project/.env`
3. Verify Agora Console: https://console.agora.io/
4. Restart both servers
5. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Call request not appearing
**Fix:**
1. Ensure doctor is online (toggle switch)
2. Check backend console for errors
3. Refresh doctor's page
4. Check network tab in browser (F12)

### Issue: Video not full screen
**Fix:**
1. Already fixed in code
2. Clear browser cache
3. Hard refresh (Ctrl+F5)

### Issue: No remote video
**Fix:**
1. Check browser console (F12) for errors
2. Allow camera/microphone permissions
3. Check Agora token generation
4. Verify both users joined same channel

---

## 📊 API Endpoints Status

### Must Work:
- ✅ `POST /api/auth/login`
- ✅ `POST /api/calls/initiate`
- ✅ `GET /api/calls/{id}` (for polling)
- ✅ `PUT /api/calls/{id}/accept`
- ✅ `PUT /api/calls/{id}/reject`
- ✅ `GET /api/calls/incoming/{userId}`
- ✅ `GET /api/agora/token`
- ✅ `POST /api/calls/doctor/online`
- ✅ `GET /api/calls/doctors/available`

### Should Work:
- ✅ `POST /api/appointments/book`
- ✅ `PUT /api/appointments/{id}/approve`
- ✅ `PUT /api/appointments/{id}/reject`
- ✅ `DELETE /api/appointments/{id}`
- ✅ `GET /api/medicines/search`
- ✅ `GET /api/pharmacies`

---

## 🎨 UI/UX Verification

### Video Call Room:
- [ ] Full screen (covers entire viewport)
- [ ] Local video: bottom-right, 256x192px
- [ ] Remote video: full screen
- [ ] Controls: bottom center
- [ ] 3 buttons only: Mute, Video, End Call
- [ ] No reject button ✓
- [ ] Connection status: top left
- [ ] Network quality: visible
- [ ] User names: displayed on videos

### Waiting Modal:
- [ ] Centered on screen
- [ ] Shows "Waiting for Doctor" message
- [ ] Animated clock icon
- [ ] Cancel button visible
- [ ] Blocks interaction with background

### Appointments:
- [ ] Status badges colored correctly
- [ ] Cancel button only on PENDING ✓
- [ ] No cancel on APPROVED ✓
- [ ] Confirmation dialogs appear

---

## 📝 Final Checklist

Before marking as complete:

- [ ] All 3 critical scenarios pass
- [ ] Agora integration works
- [ ] Video call is full screen
- [ ] No reject button in call room
- [ ] Patient can't cancel approved appointments
- [ ] Call request/accept flow works
- [ ] Both users enter room only after acceptance
- [ ] All API tests pass
- [ ] No console errors
- [ ] No backend errors

---

## ✨ Success Criteria

**Project is ready when:**
1. ✅ All checkboxes above are checked
2. ✅ All 3 critical scenarios pass
3. ✅ No errors in console
4. ✅ Video call works smoothly
5. ✅ All requested changes implemented:
   - Full screen video ✓
   - No reject in call room ✓
   - No cancel for approved appointments ✓
   - Call request flow ✓

---

## 🆘 Need Help?

1. Check `COMPLETE_SYSTEM_VERIFICATION.md` for detailed tests
2. Check `VERIFY_AGORA_CREDENTIALS.md` for Agora issues
3. Run `TEST_ALL_APIS.bat` to verify backend
4. Check browser console (F12) for frontend errors
5. Check backend console for server errors

---

**Quick Test Command:**
```bash
# Test everything at once
TEST_ALL_APIS.bat
```

**Expected Result:** All tests PASS ✅
