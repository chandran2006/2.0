# Network Access Setup Instructions

## On Host Machine (192.168.29.145):

1. Start Backend:
   cd projectbackend
   mvnw spring-boot:run

2. Start Frontend:
   cd project
   npm run dev
   (Frontend will be accessible at http://192.168.29.145:5173)

3. Start Call Server:
   cd call-server
   npm start

## On External Device:

1. Connect to same WiFi network
2. Open browser and go to: http://192.168.29.145:5173
3. Login with demo accounts:
   - Patient: patient1@teleasha.com / password123
   - Doctor: dr.sharma@teleasha.com / password123

## Firewall Rules (if needed):

Run as Administrator:
netsh advfirewall firewall add rule name="Spring Boot" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="Vite Dev" dir=in action=allow protocol=TCP localport=5173
netsh advfirewall firewall add rule name="Call Server" dir=in action=allow protocol=TCP localport=5002

## Troubleshooting:

1. Verify IP: ipconfig
2. Test backend: http://192.168.29.145:8080/api/auth/test-db
3. Check firewall: netsh advfirewall show allprofiles
4. Restart all services after changes
