# Agora Video Call Setup Instructions

## The video call feature requires valid Agora credentials.

### Steps to Enable Video Calls:

1. **Create Agora Account**
   - Go to: https://console.agora.io/
   - Sign up for a free account (no credit card required)
   - Free tier includes 10,000 minutes/month

2. **Create a Project**
   - Click "Create Project"
   - Enter project name (e.g., "TeleAsha")
   - Choose "Secured mode: APP ID + Token"
   - Click "Submit"

3. **Get Credentials**
   - Copy your **App ID**
   - Click "Edit" and enable "Primary Certificate"
   - Copy your **App Certificate**

4. **Update Configuration**
   - Open: `projectbackend/src/main/resources/application.properties`
   - Replace:
     ```properties
     agora.app.id=YOUR_ACTUAL_APP_ID
     agora.app.certificate=YOUR_ACTUAL_CERTIFICATE
     ```

5. **Restart Backend**
   ```bash
   cd projectbackend
   mvnw spring-boot:run
   ```

6. **Test Video Call**
   - Login as doctor and patient in different browsers
   - Doctor: Go to Consultations and start a call
   - Patient: Accept the incoming call
   - Video call should work!

### Current Error:
The error "invalid vendor key, can not find appid" means the App ID is not valid.
You must use real credentials from Agora Console.

### Free Tier Limits:
- 10,000 minutes/month free
- Perfect for testing and small deployments
- No credit card required for signup
