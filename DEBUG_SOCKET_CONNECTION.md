# Debug Socket Connection Issue

## Step 1: Check Call Server is Running

Open: http://localhost:5002/health

Should see:
```json
{
  "status": "healthy",
  "onlineDoctors": 0,
  "onlinePatients": 0
}
```

## Step 2: Check Console Logs

### Doctor Console (F12):
When you open Consultation Requests page, you should see:
```
Connecting to call server...
Connected to call server, socket ID: ABC123
Registering doctor online: 2 Dr. Sharma
```

### Patient Console (F12):
When you open Find Doctors page, you should see:
```
Patient connecting to call server: http://localhost:5002
Patient connected to call server, socket ID: XYZ789
Patient registered: 1 Patient Name
```

### Call Server Console:
Should see:
```
✅ Client connected: ABC123
👨⚕️ Doctor online: Dr. Sharma (ID: 2)
📊 Total online doctors: 1

✅ Client connected: XYZ789
👤 Patient online: Patient Name (ID: 1)
```

## Step 3: Test Request Flow

### Patient clicks "Call Now":
**Patient Console should show:**
```
Sending consultation request: { roomId: "call_1_2_...", doctorId: 2, patientId: 1 }
✅ Consultation request sent to doctor: 2
```

**Call Server Console should show:**
```
📞 Consultation request: Patient Name → Dr. Sharma
```

**Doctor Console should show:**
```
✅ Consultation request received: { patientName: "Patient Name", ... }
```

## If Request Not Showing:

### Check 1: Is doctor on correct page?
- URL must be: `/doctor/consultation-requests`
- NOT on: `/doctor/consultations`

### Check 2: Is doctor socket connected?
- Check doctor console for "Connected to call server"
- Check call server console for "Doctor online"

### Check 3: Is call server running?
```bash
# In call-server terminal, should see:
🏥 MeDora Call Server Started
📡 Port: 5002
```

### Check 4: Check online doctors list
Open: http://localhost:5002/api/online-doctors

Should return:
```json
{
  "doctors": [
    {
      "doctorId": 2,
      "name": "Dr. Sharma",
      "specialization": "General Physician"
    }
  ]
}
```

## Manual Test via Browser Console

### On Patient Page (F12 Console):
```javascript
// Check if socket is connected
console.log('Socket connected:', socket?.connected);

// Manually send request
socket.emit('consultation_request', {
  consultationId: 'test_123',
  doctorId: 2,
  patientId: 1,
  patientName: 'Test Patient',
  reason: 'Test request'
});
```

### On Doctor Page (F12 Console):
```javascript
// Check if socket is connected
console.log('Socket connected:', socket?.connected);

// Check if listening for requests
socket.listeners('consultation_request');
```

## Common Issues & Fixes

### Issue 1: "Socket not connected"
**Fix:**
- Restart call server
- Refresh both pages
- Check call server is on port 5002

### Issue 2: Doctor not in onlineDoctors list
**Fix:**
- Doctor must be on `/doctor/consultation-requests` page
- Check doctor console for "Registering doctor online"
- Check call server console for "Doctor online"

### Issue 3: Request sent but not received
**Fix:**
- Check call server console for errors
- Verify doctorId matches (should be 2 for Dr. Sharma)
- Restart call server and refresh both pages

### Issue 4: Multiple socket connections
**Fix:**
- Close all browser tabs
- Restart call server
- Open fresh tabs

## Quick Fix Steps

1. **Stop all servers** (Ctrl+C in all terminals)
2. **Restart call server:**
   ```bash
   cd call-server
   npm start
   ```
3. **Restart frontend:**
   ```bash
   cd project
   npm run dev
   ```
4. **Doctor:** Login → Go to `/doctor/consultation-requests`
5. **Patient:** Login → Go to `/patient/doctors`
6. **Check consoles** for connection logs
7. **Patient:** Click "Call Now"
8. **Check all 3 consoles** for request flow

## Expected Full Flow Logs

### Call Server:
```
✅ Client connected: ABC123
👨⚕️ Doctor online: Dr. Sharma (ID: 2)
📊 Total online doctors: 1
✅ Client connected: XYZ789
👤 Patient online: Patient Name (ID: 1)
📞 Consultation request: Patient Name → Dr. Sharma
```

### Doctor Console:
```
Connecting to call server...
Connected to call server, socket ID: ABC123
Registering doctor online: 2 Dr. Sharma
✅ Consultation request received: {...}
```

### Patient Console:
```
Patient connecting to call server: http://localhost:5002
Patient connected to call server, socket ID: XYZ789
Patient registered: 1 Patient Name
Sending consultation request: {...}
✅ Consultation request sent to doctor: 2
```

If you see all these logs, the system is working correctly!
