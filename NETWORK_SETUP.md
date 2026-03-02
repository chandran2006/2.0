# Network Configuration Summary

## ✅ Configuration Complete

### Backend (Laptop 1)
**application.properties**
```properties
server.address=0.0.0.0
```
- Binds to all network interfaces
- MySQL stays on localhost:3306

**CorsConfig.java**
```java
.allowedOriginPatterns("http://localhost:*", "http://192.168.*.*:*")
```
- Accepts requests from any device on 192.168.x.x network

### Frontend (Both Laptops)
**.env**
```
VITE_API_URL=http://192.168.29.145:8080/api
VITE_SOCKET_URL=http://192.168.29.145:5002
```

### Access URLs
- **Laptop 1**: http://localhost:5173 or http://192.168.29.145:5173
- **Laptop 2**: http://192.168.29.145:5173

## 🚀 Start Services

### Laptop 1
```bash
# Terminal 1 - Backend
cd projectbackend
mvnw spring-boot:run

# Terminal 2 - Frontend
cd project
npm run dev -- --host

# Terminal 3 - Call Server
cd call-server
npm start
```

## 🔥 Firewall (Windows)
If still blocked, allow ports:
```powershell
netsh advfirewall firewall add rule name="Spring Boot" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="Vite Dev" dir=in action=allow protocol=TCP localport=5173
netsh advfirewall firewall add rule name="Call Server" dir=in action=allow protocol=TCP localport=5002
```

## ✅ Test
From Laptop 2:
- http://192.168.29.145:8080/api/appointments/doctors
- http://192.168.29.145:5173
