import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
const envContent = `# Auto-generated network configuration
# Generated on: ${new Date().toLocaleString()}
# Detected IP: ${ip}

VITE_API_URL=http://${ip}:8080/api
VITE_WS_URL=http://${ip}:8080
VITE_CALL_SERVER_URL=http://${ip}:5002
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log(`✓ Network configuration updated`);
console.log(`✓ Detected IP: ${ip}`);
console.log(`✓ Frontend URL: http://${ip}:5173`);
console.log(`✓ Backend URL: http://${ip}:8080`);
