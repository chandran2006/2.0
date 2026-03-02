# Debug Toggle Reset Issue

## Check These Steps:

### Step 1: Open Browser Console (F12)
When you load the Schedule page, you should see:
```
Loading doctor status for user: 2
User data from DB: { id: 2, name: "Dr. Sharma", isAvailable: true, ... }
Set toggle to: true
```

### Step 2: Check Database Directly
```sql
USE medora;
SELECT id, name, email, is_available FROM users WHERE role = 'DOCTOR';
```

Should show:
```
| id | name       | email                    | is_available |
|----|------------|--------------------------|--------------|
| 2  | Dr. Sharma | dr.sharma@teleasha.com   | 1            |
```

### Step 3: Toggle ON and Check
1. Toggle to ON
2. Check console: "Set toggle to: true"
3. Refresh page
4. Check console: Should load "true" from DB

### Step 4: Check API Response
Open browser console and run:
```javascript
fetch('http://localhost:8080/api/auth/current-user/2')
  .then(r => r.json())
  .then(d => console.log('User data:', d));
```

Should return: `{ ..., isAvailable: true, ... }`

## If Toggle Still Resets:

### Possible Cause 1: Database not saving
**Check backend console when you toggle:**
```
Updating availability for doctor 2 to true
Doctor availability updated successfully: true
```

### Possible Cause 2: Wrong user ID
**Check console:**
```
Loading doctor status for user: 2
```
Make sure ID matches the doctor's actual ID

### Possible Cause 3: API returning wrong data
**Check network tab (F12 → Network):**
1. Refresh page
2. Find request to `/api/auth/current-user/2`
3. Check response shows `isAvailable: true`

## Quick Fix Test:

### Test 1: Manual Database Update
```sql
UPDATE users SET is_available = 1 WHERE id = 2;
SELECT id, name, is_available FROM users WHERE id = 2;
```

Then refresh Schedule page - toggle should be ON

### Test 2: Check Backend Logs
When you toggle ON, backend should print:
```
Doctor going online: 2
Updating availability for doctor 2 to true
Doctor availability updated successfully: true
```

### Test 3: Check Frontend Logs
When page loads:
```
Loading doctor status for user: 2
User data from DB: {...}
Set toggle to: true (or false)
```

## Common Issues:

### Issue 1: isAvailable is null in DB
**Fix:** Toggle once to set it, then it will persist

### Issue 2: Multiple browser tabs
**Fix:** Close all tabs, open only one

### Issue 3: Cache issue
**Fix:** Hard refresh (Ctrl+Shift+R)

### Issue 4: Backend not saving
**Fix:** Check backend console for errors

## Expected Behavior:

1. ✅ Toggle ON → Saves `true` to database
2. ✅ Refresh page → Loads `true` from database → Toggle shows ON
3. ✅ Close browser → Database keeps `true`
4. ✅ Open again → Toggle shows ON
5. ✅ Only manual toggle changes status

## Test Right Now:

1. Open Schedule page
2. Open console (F12)
3. Toggle to ON
4. Check console logs
5. Refresh page
6. Check if toggle stays ON
7. Share console logs if it resets
