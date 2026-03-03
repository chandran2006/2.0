@echo off
echo Setting up network environment...
set VITE_API_URL=http://192.168.29.145:8080/api
set VITE_WS_URL=http://192.168.29.145:8080
set VITE_CALL_SERVER_URL=http://192.168.29.145:5002
echo Starting frontend on network mode...
npm run dev
