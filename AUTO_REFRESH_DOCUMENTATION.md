# Auto-Refresh Feature Documentation

## Overview
Auto-refresh functionality has been implemented across all major pages to ensure users always see the latest data without manual page refresh.

## Implementation

### Custom Hook: `useAutoRefresh`
**Location:** `project/src/hooks/use-auto-refresh.ts`

```typescript
useAutoRefresh(callback, interval, dependencies)
```

**Parameters:**
- `callback`: Function to call on each refresh
- `interval`: Refresh interval in milliseconds (default: 10000ms = 10s)
- `dependencies`: Array of dependencies (like useEffect)

**Features:**
- Calls callback immediately on mount
- Sets up automatic interval-based refresh
- Cleans up interval on unmount
- Re-initializes when dependencies change

## Pages with Auto-Refresh

### 1. Patient Appointments Page
**File:** `project/src/pages/patient/AppointmentsPage.tsx`
**Refresh Interval:** 10 seconds
**What Refreshes:** 
- List of patient appointments
- Appointment status updates (PENDING → APPROVED)
- New appointments

**Usage:**
```typescript
useAutoRefresh(loadAppointments, 10000, [user]);
```

### 2. Doctor Appointments Page
**File:** `project/src/pages/doctor/AppointmentsPage.tsx`
**Refresh Interval:** 10 seconds
**What Refreshes:**
- Incoming appointment requests
- Appointment status changes
- Patient information

**Usage:**
```typescript
useAutoRefresh(loadAppointments, 10000, [user]);
```

### 3. Patient Prescriptions Page
**File:** `project/src/pages/patient/PrescriptionsPage.tsx`
**Refresh Interval:** 15 seconds
**What Refreshes:**
- New prescriptions from doctors
- Prescription status updates
- Medicine details

**Usage:**
```typescript
useAutoRefresh(loadPrescriptions, 15000, [user]);
```

### 4. Doctor Consultation Requests Page
**File:** `project/src/pages/doctor/ConsultationRequestsPage.tsx`
**Refresh Interval:** Real-time via WebSocket
**What Refreshes:**
- Incoming consultation requests
- Request status updates

**Note:** This page uses WebSocket for real-time updates, not polling.

## Benefits

### For Users
✅ Always see latest data without manual refresh
✅ Real-time updates for appointments and prescriptions
✅ Better user experience
✅ No need to reload the page

### For System
✅ Reduced server load (compared to constant polling)
✅ Configurable refresh intervals
✅ Automatic cleanup on component unmount
✅ Prevents memory leaks

## Refresh Intervals by Page Type

| Page Type | Interval | Reason |
|-----------|----------|--------|
| Appointments | 10s | Moderate update frequency |
| Prescriptions | 15s | Lower update frequency |
| Consultation Requests | Real-time | Immediate notification needed |
| Orders | 10s | Moderate update frequency |
| Inventory | 20s | Low update frequency |

## How It Works

### 1. Initial Load
```
Component Mounts
    ↓
useAutoRefresh called
    ↓
Callback executed immediately
    ↓
Data loaded and displayed
```

### 2. Auto-Refresh Cycle
```
Wait for interval (e.g., 10s)
    ↓
Callback executed
    ↓
API call made
    ↓
Data updated in state
    ↓
UI re-renders with new data
    ↓
Repeat
```

### 3. Cleanup
```
Component Unmounts
    ↓
useAutoRefresh cleanup
    ↓
Interval cleared
    ↓
No memory leaks
```

## Adding Auto-Refresh to New Pages

### Step 1: Import the Hook
```typescript
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
```

### Step 2: Create Load Function
```typescript
const loadData = () => {
  if (user?.id) {
    api.getData(user.id)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }
};
```

### Step 3: Use the Hook
```typescript
useAutoRefresh(loadData, 10000, [user]);
```

### Complete Example
```typescript
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import { api } from '@/services/api';

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    if (user?.id) {
      api.getData(user.id)
        .then(res => setData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  // Auto-refresh every 10 seconds
  useAutoRefresh(loadData, 10000, [user]);

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

## Customizing Refresh Intervals

### Fast Updates (5 seconds)
For critical real-time data:
```typescript
useAutoRefresh(loadData, 5000, [user]);
```

### Standard Updates (10 seconds)
For regular data:
```typescript
useAutoRefresh(loadData, 10000, [user]);
```

### Slow Updates (30 seconds)
For less frequently changing data:
```typescript
useAutoRefresh(loadData, 30000, [user]);
```

## Performance Considerations

### Best Practices
✅ Use appropriate intervals (don't refresh too frequently)
✅ Cancel requests on unmount
✅ Handle loading states properly
✅ Show loading indicators only on initial load
✅ Use silent updates for auto-refresh

### Avoid
❌ Refreshing every second (too frequent)
❌ Multiple refresh hooks on same page
❌ Refreshing when user is inactive
❌ Not cleaning up intervals

## Testing Auto-Refresh

### Manual Testing
1. Open page with auto-refresh
2. Open browser console
3. Watch for API calls every X seconds
4. Verify data updates automatically
5. Navigate away and verify cleanup

### Console Verification
```javascript
// Check if interval is running
console.log('Intervals:', window.setInterval.length);

// Monitor API calls
// Open Network tab in DevTools
// Filter by API endpoint
// Watch for periodic calls
```

## Troubleshooting

### Issue: Data not refreshing
**Check:**
- Is the hook properly imported?
- Is the callback function correct?
- Are dependencies correct?
- Check browser console for errors

### Issue: Too many API calls
**Solution:**
- Increase refresh interval
- Check for multiple hooks on same page
- Verify cleanup is working

### Issue: Memory leaks
**Solution:**
- Ensure component unmounts properly
- Verify interval cleanup in useEffect
- Check for circular dependencies

## Future Enhancements

### Planned Features
- [ ] Pause refresh when tab is inactive
- [ ] Exponential backoff on errors
- [ ] Manual refresh button
- [ ] Last updated timestamp display
- [ ] Refresh indicator animation
- [ ] User-configurable intervals
- [ ] Smart refresh (only when data changes)

### WebSocket Migration
For real-time critical pages, consider migrating from polling to WebSocket:
- Consultation requests ✅ (Already using WebSocket)
- Appointments (Planned)
- Prescriptions (Planned)
- Orders (Planned)

## Summary

Auto-refresh is now enabled on:
- ✅ Patient Appointments (10s)
- ✅ Doctor Appointments (10s)
- ✅ Patient Prescriptions (15s)
- ✅ Doctor Consultation Requests (Real-time)

Users will now see updates automatically without manual page refresh!
