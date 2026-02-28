# MeDora Setup Guide

## Prerequisites Installation

### 1. Install Java 17
- Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Set JAVA_HOME environment variable
- Verify: `java -version`

### 2. Install Node.js
- Download from: https://nodejs.org/ (LTS version)
- Verify: `node -v` and `npm -v`

### 3. Install Maven (Optional - Maven Wrapper included)
- Download from: https://maven.apache.org/download.cgi
- Verify: `mvn -version`

## Quick Start (Windows)

### Option 1: Run All Services at Once
```bash
# Double-click START_ALL.bat
# OR run from command line:
START_ALL.bat
```

### Option 2: Manual Setup

#### Terminal 1 - Backend
```bash
cd projectbackend
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```
Backend will start on: http://localhost:8080

#### Terminal 2 - Frontend
```bash
cd project
npm install
npm run dev
```
Frontend will start on: http://localhost:5173

#### Terminal 3 - Call Server
```bash
cd call-server
npm install
npm start
```
Call server will start on: http://localhost:5002

## Accessing the Application

1. Open browser: http://localhost:5173
2. You'll see the landing page
3. Click "Login" or "Sign Up"

## Demo Accounts

### Patient Account
- Email: patient1@teleasha.com
- Password: password123
- Features: Book appointments, view prescriptions, search medicines

### Doctor Account
- Email: dr.sharma@teleasha.com
- Password: password123
- Features: Manage appointments, create prescriptions, go online/offline

### Pharmacy Account
- Email: pharmacy@teleasha.com
- Password: pharmacy123
- Features: Manage inventory, add medicines, view prescriptions

### Admin Account
- Email: admin@teleasha.com
- Password: admin123
- Features: View system statistics, manage users

## Testing the Application

### 1. Patient Flow
1. Login as patient
2. View dashboard with health metrics
3. Navigate to appointments tab
4. Book a new appointment with a doctor

### 2. Doctor Flow
1. Login as doctor
2. Toggle "Online" status
3. View pending appointments
4. Approve appointments
5. Create prescriptions for patients

### 3. Pharmacy Flow
1. Login as pharmacy
2. View inventory
3. Add new medicines
4. Check stock levels

## Database Access

H2 Console (Development):
- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:medora
- Username: sa
- Password: (leave empty)

## API Testing

### Using curl:
```bash
# Health check
curl http://localhost:8080/api/test/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient1@teleasha.com","password":"password123"}'

# Get doctors
curl http://localhost:8080/api/appointments/doctors
```

### Using Postman:
Import the following base URL: http://localhost:8080/api

## Troubleshooting

### Backend won't start
- Check if Java 17 is installed: `java -version`
- Check if port 8080 is available
- Check logs in terminal

### Frontend won't start
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Check if port 5173 is available

### Call Server won't start
- Check if port 5002 is available
- Reinstall dependencies: `npm install`

### Database issues
- Backend uses H2 in-memory database
- Data resets on restart
- Check application.properties for configuration

## Project Structure

```
2.0/
├── projectbackend/          # Spring Boot Backend (Port 8080)
│   ├── src/
│   │   ├── main/java/com/example/projectbackend/
│   │   │   ├── controller/     # 13 REST Controllers
│   │   │   ├── service/        # 8 Service Classes
│   │   │   ├── model/          # 9 Entity Models
│   │   │   ├── repository/     # 9 JPA Repositories
│   │   │   └── config/         # Configuration Classes
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
│
├── project/                 # React Frontend (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboards/    # 4 Role-based Dashboards
│   │   │   └── shared/        # Shared Components
│   │   ├── contexts/          # AuthContext
│   │   ├── services/          # API Services
│   │   ├── types/             # TypeScript Interfaces
│   │   └── pages/             # Page Components
│   └── package.json
│
├── call-server/             # WebRTC Server (Port 5002)
│   ├── server.js
│   └── package.json
│
├── START_ALL.bat            # Windows startup script
└── README.md
```

## Features Implemented

✅ User Authentication (Login/Register)
✅ Role-based Dashboards (Patient, Doctor, Pharmacy, Admin)
✅ Appointment Management (Book, Approve, Cancel)
✅ Prescription System (Create, View, Track)
✅ Medicine Inventory (Add, Search, Update Stock)
✅ Real-time Communication (WebSocket/Socket.IO)
✅ Doctor Availability Status
✅ Health Metrics Display
✅ Responsive UI with TailwindCSS

## Next Steps

1. Implement video call functionality (WebRTC integration)
2. Add symptom checker with AI
3. Implement pharmacy finder with maps
4. Add file upload for health records
5. Implement real-time notifications
6. Add payment integration
7. Deploy to production

## Support

For issues or questions:
- Check logs in terminal
- Review API documentation in README.md
- Check database in H2 console

## License

MIT License - See LICENSE file for details
