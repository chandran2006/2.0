# Quick Start - Test Doctor Online Status

## Step 1: Start Backend Server
```bash
cd projectbackend
mvnw spring-boot:run
```
Wait for: "Started ProjectbackendApplication"

## Step 2: Start Call Server
```bash
cd call-server
npm start
```
Wait for: "🏥 MeDora Call Server Started"

## Step 3: Start Frontend
```bash
cd project
npm run dev
```
Wait for: "Local: http://localhost:5173/"

## Step 4: Test Doctor Online
1. Open browser: http://localhost:5173
2. Login as doctor: `dr.sharma@teleasha.com` / `password123`
3. Click "Schedule" in sidebar
4. Toggle "Online Status" switch to ON
5. Check for success toast: "You are now online"

## Step 5: Test Patient View
1. Open new incognito window: http://localhost:5173
2. Login as patient: `patient1@teleasha.com` / `password123`
3. Click "Find Doctors" in sidebar
4. Verify Dr. Sharma shows:
   - ✅ Green pulsing dot
   - ✅ "Online Now" text
   - ✅ "Call Now" button

## Troubleshooting

### If frontend won't start:
```bash
cd project
npm install
npm run dev
```

### If backend fails:
- Check MySQL is running
- Verify database credentials in application.properties

### If call server fails:
```bash
cd call-server
npm install
npm start
```

### Check all servers are running:
- Backend: http://localhost:8080/api/calls/doctors/available
- Call Server: http://localhost:5002/health
- Frontend: http://localhost:5173

## All files are ready - just start the servers!
