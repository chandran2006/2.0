# Debug Doctor Online Status

## Step 1: Check Backend is Running
Open browser: http://localhost:8080/api/calls/doctors/available

Should return: `[]` or list of doctors

## Step 2: Test API Directly (Use Browser Console or Postman)

### Test Doctor Online API
```javascript
fetch('http://localhost:8080/api/calls/doctor/online', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ doctorId: 2 })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

Expected response: `{ message: "Doctor is now online", success: true }`

### Test Doctor Offline API
```javascript
fetch('http://localhost:8080/api/calls/doctor/offline', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ doctorId: 2 })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

## Step 3: Check Frontend Console Logs

When you toggle the switch, you should see:
1. `Updating doctor status: { doctorId: X, checked: true/false }`
2. `Doctor online response: { ... }` or `Doctor offline response: { ... }`
3. `Emitted doctor_online event` or `Emitted doctor_offline event`

## Step 4: Check Backend Console Logs

Backend should print:
1. `Doctor going online: X` or `Doctor going offline: X`
2. `Updating availability for doctor X to true/false`
3. `Doctor availability updated successfully: true/false`

## Step 5: Verify Database

```sql
USE medora;
SELECT id, name, email, role, is_available FROM users WHERE role = 'DOCTOR';
```

The `is_available` column should change when you toggle.

## Common Issues & Solutions

### Issue 1: "User not found" error
**Cause**: User object doesn't have ID
**Solution**: Check if you're logged in. Logout and login again.

### Issue 2: "Failed to update status" error
**Cause**: Backend API call failed
**Check**: 
- Is backend running on port 8080?
- Check backend console for errors
- Check browser Network tab for failed requests

### Issue 3: Backend returns 404
**Cause**: Endpoint not found
**Solution**: Restart backend server

### Issue 4: CORS error
**Cause**: Frontend can't access backend
**Solution**: Already configured in CorsConfig.java

### Issue 5: Database error
**Cause**: MySQL not running or wrong credentials
**Solution**: 
- Start MySQL
- Check application.properties credentials

## Quick Test Commands

### Check if MySQL is running:
```bash
mysql -u root -p
```

### Check backend logs:
Look for errors in the terminal where you ran `mvnw spring-boot:run`

### Check frontend logs:
Open browser DevTools (F12) → Console tab

### Check call server logs:
Look at terminal where you ran `npm start` in call-server folder

## Expected Flow

1. Doctor clicks toggle → Frontend calls API
2. Backend updates database → Returns success
3. Frontend emits socket event → Call server receives
4. Call server broadcasts → Patient receives update
5. Patient UI updates → Shows green dot

## If Still Not Working

1. Restart all 3 servers
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try in incognito mode
4. Check all console logs for errors
5. Verify doctor ID exists in database
