# Call Notification Flow - Working Implementation ✅

## Overview
When a patient clicks "Call Now" button, the doctor receives a real-time notification request.

## Flow Diagram

```
Patient (DoctorsPage.tsx)
    ↓ [Clicks "Call Now"]
    ↓ Emits: consultation_request
    ↓
Call Server (server.js:5002)
    ↓ Receives request
    ↓ Finds doctor's socketId
    ↓ Emits to doctor: consultation_request
    ↓
Doctor (ConsultationRequestsPage.tsx)
    ↓ Receives notification
    ↓ Shows request card
    ↓ Plays notification sound
    ↓ Shows toast notification
```

## Implementation Details

### 1. Patient Side (DoctorsPage.tsx)
**Location:** `project/src/pages/patient/DoctorsPage.tsx`

```typescript
// When patient clicks "Call Now"
const handleInstantConsultation = (doctor: any) => {
  const roomId = `call_${user?.id}_${doctor.id}_${Date.now()}`;
  
  socket.emit('consultation_request', {
    consultationId: roomId,
    doctorId: doctor.id,
    patientId: user?.id,
    patientName: user?.name,
    reason: 'Instant consultation request'
  });
  
  // Listen for acceptance
  socket.once('consultation_accepted', (data) => {
    window.location.href = `/call?room=${roomId}`;
  });
}
```

### 2. Call Server (server.js)
**Location:** `call-server/server.js`
**Port:** 5002

```javascript
// Receives consultation request from patient
socket.on('consultation_request', (data) => {
  const doctor = onlineDoctors.get(data.doctorId);
  if (doctor) {
    // Forward to doctor's socket
    io.to(doctor.socketId).emit('consultation_request', {
      consultationId: data.consultationId,
      patientId: data.patientId,
      patientName: data.patientName,
      reason: data.reason,
      timestamp: Date.now()
    });
  }
});
```

### 3. Doctor Side (ConsultationRequestsPage.tsx)
**Location:** `project/src/pages/doctor/ConsultationRequestsPage.tsx`

```typescript
// Doctor listens for consultation requests
socket.on('consultation_request', (data) => {
  console.log('✅ Consultation request received:', data);
  setRequests(prev => [...prev, data]);
  
  // Play notification sound
  const audio = new Audio('...');
  audio.play();
  
  // Show toast notification
  toast({
    title: '🔔 New Consultation Request',
    description: `${data.patientName} wants to consult`,
  });
});
```

## Prerequisites for Testing

### 1. Doctor Must Be Online
- Doctor goes to **Schedule** page
- Toggles **Online Status** switch to ON
- This emits `doctor_online` event to call server
- Call server stores doctor's socketId

### 2. Patient Can See Online Doctors
- Patient goes to **Doctors** page
- Online doctors show green "Online Now" badge
- "Call Now" button appears for online doctors

### 3. Doctor Must Be on Consultation Requests Page
- Doctor navigates to **Consultation Requests** page
- Socket connection established
- Listening for `consultation_request` events

## Testing Steps

1. **Start all servers:**
   ```bash
   # Terminal 1 - Backend
   cd projectbackend
   mvnw spring-boot:run

   # Terminal 2 - Frontend
   cd project
   npm run dev

   # Terminal 3 - Call Server
   cd call-server
   npm start
   ```

2. **Login as Doctor:**
   - Email: dr.sharma@teleasha.com
   - Password: password123
   - Go to Schedule page
   - Toggle "Online Status" to ON
   - Navigate to "Consultation Requests" page

3. **Login as Patient (different browser/incognito):**
   - Email: patient1@teleasha.com
   - Password: password123
   - Go to "Find Doctors" page
   - Find Dr. Sharma (should show "Online Now")
   - Click "Call Now" button

4. **Expected Result:**
   - Doctor receives notification on Consultation Requests page
   - Request card appears with patient name
   - Toast notification shows
   - Notification sound plays
   - Doctor can Accept or Reject

## Troubleshooting

### Issue: Doctor doesn't receive notification

**Check 1:** Is doctor online?
```javascript
// In browser console on doctor's page
console.log('Socket connected:', socket.connected);
```

**Check 2:** Is call server running?
```bash
curl http://localhost:5002/health
```

**Check 3:** Check call server logs
```
✅ Client connected: [socketId]
👨⚕️ Doctor online: Dr. Sharma (ID: 2)
📞 Consultation request: Patient Name → Dr. Sharma
```

**Check 4:** Is doctor on Consultation Requests page?
- Doctor must be actively on this page to receive notifications
- Socket listener is set up in useEffect of this component

### Issue: "Call Now" button not showing

**Reason:** Doctor is offline
- Doctor must toggle online status in Schedule page
- Check if green "Online Now" badge appears

## Key Files

| File | Purpose |
|------|---------|
| `project/src/pages/patient/DoctorsPage.tsx` | Patient initiates call |
| `call-server/server.js` | Routes notifications |
| `project/src/pages/doctor/ConsultationRequestsPage.tsx` | Doctor receives notifications |
| `project/src/pages/doctor/SchedulePage.tsx` | Doctor goes online/offline |

## Socket Events

| Event | Direction | Data |
|-------|-----------|------|
| `doctor_online` | Doctor → Server | `{doctorId, name, specialization}` |
| `consultation_request` | Patient → Server → Doctor | `{consultationId, patientId, patientName, reason}` |
| `consultation_accepted` | Doctor → Server → Patient | `{consultationId, roomId, doctorId}` |
| `consultation_rejected` | Doctor → Server → Patient | `{consultationId, reason}` |

## Status: ✅ FULLY IMPLEMENTED

The call notification system is already working! Just ensure:
1. Call server is running on port 5002
2. Doctor is online (Schedule page toggle)
3. Doctor is on Consultation Requests page
4. Patient clicks "Call Now" on an online doctor
