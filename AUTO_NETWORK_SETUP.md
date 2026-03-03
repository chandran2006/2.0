# Auto Network Configuration

The project now automatically detects your network IP and configures itself.

## Quick Start

### Option 1: Start All Services (Recommended)
```bash
start-all.bat
```

### Option 2: Manual Start

**Backend:**
```bash
cd projectbackend
mvnw spring-boot:run
```
Backend will display network URLs on startup.

**Frontend:**
```bash
cd project
npm run dev
```
Frontend auto-detects IP and updates .env before starting.

## How It Works

- **Frontend**: Runs `setup-network.js` before starting to detect IP and update `.env`
- **Backend**: Displays local and network URLs on startup
- **No manual IP configuration needed** - works on any network

## Access From Other Devices

1. Start services using `start-all.bat` or manually
2. Note the IP address shown in backend console
3. On external device, open: `http://[IP]:5173`

## Scripts

- `npm run dev` - Auto-detect IP and start (network mode)
- `npm run dev:local` - Start without IP detection (localhost only)
- `npm run setup-network` - Only update network configuration

## Firewall (First Time Only)

Run as Administrator:
```bash
netsh advfirewall firewall add rule name="MeDora Backend" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="MeDora Frontend" dir=in action=allow protocol=TCP localport=5173
```
