# Debug "Unable to Start Conversation" Error

## Step-by-Step Checklist

### 1. Check Call Server is Running
```bash
# Terminal should show:
🏥 MeDora Call Server Started
📡 Port: 5002
```

**Test:** Open http://localhost:5002/health
Should return: `{"status":"healthy",...}`

### 2. Check Doctor is Online
**Doctor must:**
- ✅ Toggle "Online Status" to ON (Dashboard or Schedule page)
- ✅ Be on `/doctor/consultation-requests` page
- ✅ Keep that page open

**Verify:**
- Open: http://localhost:5002/api/online-doctors
- Should show doctor in list

### 3. Check Browser Consoles

**Patient Console (F12):**
When you click "Call Now", should see:
```
Sending consultation request: { roomId: "call_1_2_...", doctorId: 2, patientId: 1 }
✅ Consultation request sent to doctor: 2
```

**Doctor Console (F12):**
Should see:
```
✅ Consultation request received: { patientName: "...", ... }
```

**Call Server Console:**
Should see:
```
📞 Consultation request: Patient Name → Dr. Sharma
```

### 4. Common Issues & Fixes

#### Issue 1: Doctor not on correct page
**Problem:** Doctor is on `/doctor/consultations` instead of `/doctor/consultation-requests`

**Fix:**
1. Doctor clicks "Consultations" in sidebar
2. Click "View Requests" button
3. Stay on that page

#### Issue 2: Doctor not registered in call server
**Problem:** Doctor opened page but didn't register

**Fix:**
1. Doctor refresh `/doctor/consultation-requests` page
2. Check console for: "Connected to call server"
3. Check call server console for: "Doctor online"

#### Issue 3: Socket not connected
**Problem:** Call server not running or connection failed

**Fix:**
```bash
# Restart call server
cd call-server
npm start
```

#### Issue 4: Wrong doctor ID
**Problem:** Request sent to wrong doctor

**Fix:**
- Check patient console: "doctorId: 2"
- Check doctor console: "doctorId: 2"
- IDs must match

### 5. Manual Test

**On Patient Page (F12 Console):**
```javascript
// Check socket connection
console.log('Socket connected:', socket?.connected);

// Check doctor ID
console.log('Clicking doctor:', doctor.id);

// Manually send request
socket.emit('consultation_request', {
  consultationId: 'test_123',
  doctorId: 2,  // Use actual doctor ID
  patientId: 1,
  patientName: 'Test Patient',
  reason: 'Test'
});
```

**On Doctor Page (F12 Console):**
```javascript
// Check if listening
console.log('Socket connected:', socket?.connected);
```

### 6. Complete Flow Test

**Step 1: Start Servers**
```bash
# Terminal 1
cd projectbackend
mvnw spring-boot:run

# Terminal 2
cd call-server
npm start

# Terminal 3
cd project
npm run dev
```

**Step 2: Doctor Setup**
1. Login: dr.sharma@teleasha.com / password123
2. Go to Dashboard
3. Toggle "Online Status" to ON
4. Go to Consultations → View Requests
5. Open console (F12)
6. Should see: "Connected to call server"

**Step 3: Patient Test**
1. Open incognito window
2. Login: patient1@teleasha.com / password123
3. Go to Find Doctors
4. Open console (F12)
5. Should see: "Patient connected to call server"
6. Find Dr. Sharma (green dot)
7. Click "Call Now"
8. Check console for logs

**Step 4: Verify Request**
- Patient console: "✅ Consultation request sent"
- Call server console: "📞 Consultation request"
- Doctor console: "✅ Consultation request received"
- Doctor page: Request card appears

### 7. If Still Not Working

**Check 1: Network Tab**
1. Open F12 → Network tab
2. Filter: WS (WebSocket)
3. Should see connection to localhost:5002
4. Status should be "101 Switching Protocols"

**Check 2: Call Server Logs**
Should show:
```
✅ Client connected: ABC123
👨⚕️ Doctor online: Dr. Sharma (ID: 2)
✅ Client connected: XYZ789
👤 Patient online: Patient Name (ID: 1)
📞 Consultation request: Patient Name → Dr. Sharma
```

**Check 3: Backend Logs**
When doctor toggles online:
```
Doctor going online: 2
Updating availability for doctor 2 to true
Doctor availability updated successfully: true
```

### 8. Quick Fix

**If nothing works, try this:**
1. Stop all servers (Ctrl+C)
2. Close all browser tabs
3. Restart call server: `cd call-server && npm start`
4. Restart frontend: `cd project && npm run dev`
5. Doctor: Login → Dashboard → Toggle Online → Consultations → View Requests
6. Patient: Login → Find Doctors → Click "Call Now"

### 9. Expected Success Flow

```
PATIENT                    CALL SERVER              DOCTOR
  |                             |                      |
  | Click "Call Now"            |                      |
  |─────────────────────────────>                      |
  | consultation_request        |                      |
  |                             |                      |
  | ✅ Request sent             |                      |
  |                             |                      |
  |                             | Route to doctor      |
  |                             |─────────────────────>|
  |                             |                      |
  |                             |                      | ✅ Request received
  |                             |                      | 🔔 Notification
  |                             |                      | 📋 Card appears
  |                             |                      |
  |                             |                      | Doctor clicks Accept
  |                             |<─────────────────────|
  |                             |                      |
  | ✅ Accepted                 |                      | ✅ Accepted
  |<─────────────────────────────                      |
  |                             |                      |
  | Redirect to /call           |                      | Redirect to /call
  |                             |                      |
```

### 10. Error Messages

**"Unable to start conversation"**
- Means: Request not reaching doctor
- Check: Doctor on correct page
- Check: Call server running
- Check: Socket connected

**"Connection Error - Not connected to call server"**
- Means: Patient socket not connected
- Fix: Restart call server
- Fix: Refresh patient page

**"Doctor is currently offline"**
- Means: Doctor toggle is OFF
- Fix: Doctor toggle ON in Dashboard/Schedule

## Still Having Issues?

1. Share console logs from:
   - Patient browser console
   - Doctor browser console
   - Call server terminal

2. Check these URLs:
   - http://localhost:5002/health
   - http://localhost:5002/api/online-doctors
   - http://localhost:8080/api/calls/doctors/available

3. Verify doctor is on: `/doctor/consultation-requests`
