# Where Doctor Sees Call Requests

## 📍 Location: Consultation Requests Page

### URL: `/doctor/consultation-requests`

### How to Get There:

**Option 1: From Consultations Page**
1. Doctor logs in
2. Click **"Consultations"** in sidebar
3. Click **"View Requests"** button (top right)
4. Opens Consultation Requests page

**Option 2: Direct Navigation**
1. Doctor logs in
2. Go to: http://localhost:5173/doctor/consultation-requests

## 📋 What Doctor Sees

### Before Request:
```
┌─────────────────────────────────────────┐
│  Consultation Requests                  │
│  Accept or reject incoming requests     │
├─────────────────────────────────────────┤
│                                         │
│         📹 (Video Icon)                 │
│                                         │
│    No pending consultation requests     │
│                                         │
│  Make sure you're online in Schedule    │
│                                         │
└─────────────────────────────────────────┘
```

### After Patient Clicks "Call Now":
```
┌─────────────────────────────────────────────────────────┐
│  Consultation Requests                                  │
│  Accept or reject incoming requests                     │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │  📞  Ramesh Kumar                    [Reject] [✓] │ │
│  │      Instant consultation request                 │ │
│  │      10:30:45 AM                                  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Step-by-Step Test

### Step 1: Doctor Setup
```
1. Login as: dr.sharma@teleasha.com / password123
2. Click: Schedule (sidebar)
3. Toggle: Online Status → ON
4. Click: Consultations (sidebar)
5. Click: "View Requests" button
6. STAY ON THIS PAGE ← Important!
```

### Step 2: Patient Sends Request
```
1. Open new browser (incognito)
2. Login as: patient1@teleasha.com / password123
3. Click: Find Doctors (sidebar)
4. Find: Dr. Sharma (green dot)
5. Click: "Call Now" button
```

### Step 3: Doctor Sees Request
```
Request card appears on Consultation Requests page showing:
- Patient name
- "Instant consultation request"
- Timestamp
- [Reject] button
- [Accept Call] button (green)
```

## 🔧 If Request Not Showing

### Check 1: Is doctor on correct page?
```
✅ Correct: /doctor/consultation-requests
❌ Wrong:   /doctor/consultations
❌ Wrong:   /doctor/schedule
❌ Wrong:   /dashboard
```

### Check 2: Is doctor online?
```
Go to Schedule page
Check: Online Status toggle is ON (green)
```

### Check 3: Is call server running?
```bash
# Terminal should show:
🏥 MeDora Call Server Started
📡 Port: 5002
```

### Check 4: Check browser console (F12)
```
Doctor console should show:
✅ Consultation request received: {...}

If you see this, the request arrived!
If not, check call server console.
```

## 📱 Complete Flow Diagram

```
PATIENT                    CALL SERVER              DOCTOR
  |                             |                      |
  | 1. Click "Call Now"         |                      |
  |─────────────────────────────>                      |
  |    consultation_request     |                      |
  |                             |                      |
  |                             | 2. Route to doctor   |
  |                             |─────────────────────>|
  |                             |  consultation_request|
  |                             |                      |
  |                             |                      | 3. Show request card
  |                             |                      |    on screen
  |                             |                      |
  |                             |                      | 4. Doctor clicks
  |                             |                      |    "Accept Call"
  |                             |<─────────────────────|
  |                             | consultation_accepted|
  |                             |                      |
  | 5. Redirect to call         |                      | 6. Redirect to call
  |<─────────────────────────────                      |
  |                             |                      |
  | 7. Both join video call     |                      |
  |<────────────────────────────────────────────────────>
```

## 🎬 Video Call Flow

1. **Patient** clicks "Call Now" → Request sent
2. **Doctor** sees request card on `/doctor/consultation-requests`
3. **Doctor** clicks "Accept Call" → Both redirect
4. **Both** join video call at `/call?room=ROOM_ID`

## 📂 File Locations

**Doctor sees requests in:**
- File: `project/src/pages/doctor/ConsultationRequestsPage.tsx`
- Route: `/doctor/consultation-requests`
- Component: `DoctorConsultationPage`

**Patient sends requests from:**
- File: `project/src/pages/patient/DoctorsPage.tsx`
- Route: `/patient/doctors`
- Function: `handleInstantConsultation()`

## ✅ Quick Test Checklist

- [ ] Call server running on port 5002
- [ ] Doctor logged in
- [ ] Doctor online (Schedule page toggle ON)
- [ ] Doctor on `/doctor/consultation-requests` page
- [ ] Patient logged in
- [ ] Patient on `/patient/doctors` page
- [ ] Patient clicks "Call Now"
- [ ] Request card appears on doctor's page
- [ ] Doctor clicks "Accept Call"
- [ ] Both redirect to video call

## 🎉 That's It!

The request shows on the **Consultation Requests** page at:
`/doctor/consultation-requests`

Doctor must be on this page to see incoming requests!
