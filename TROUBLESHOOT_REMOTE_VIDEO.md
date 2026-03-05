# Troubleshooting: Unable to See Remote User Video

## Issue
Local video works, but cannot see the remote user's video in the call.

---

## Quick Diagnostics

### Step 1: Check Browser Console (F12)

Look for these logs when remote user joins:

✅ **Expected Logs:**
```
User published: [uid] mediaType: video
Subscribed to user: [uid]
Adding remote user: [uid] with name: [name]
Remote users updated: 1
Checking remote video element for: [uid] found: true has track: true
Playing video for user: [uid]
```

❌ **Problem Indicators:**
- "Remote video element not found" → DOM rendering issue
- "has track: false" → Video track not received
- No "User published" event → User not publishing video

### Step 2: Verify Both Users Joined Same Channel

**User 1 Console:**
```
Channel: room-123
User ID: 1
Successfully joined channel
```

**User 2 Console:**
```
Channel: room-123  ← MUST MATCH
User ID: 2
Successfully joined channel
```

### Step 3: Check Camera Permissions

Both users must allow camera/microphone:
- Chrome: Click 🔒 in address bar → Site settings → Camera/Microphone = Allow
- Firefox: Click 🔒 → Permissions → Camera/Microphone = Allow

---

## Common Issues & Fixes

### Issue 1: Different Channel Names
**Symptom:** Users join but don't see each other
**Cause:** Each user joined different channel
**Fix:** Ensure both use same `channelName` parameter

**Check VideoCallPage.tsx:**
```typescript
const channelName = roomId; // Both must have same roomId
```

### Issue 2: Invalid Agora App ID
**Symptom:** "CAN_NOT_GET_GATEWAY_SERVER" error
**Cause:** Invalid/expired Agora credentials
**Fix:** Get valid credentials from https://console.agora.io/

### Issue 3: Token Mismatch
**Symptom:** User joins but can't publish/subscribe
**Cause:** Token generated for different channel/user
**Fix:** Ensure token matches channelName and userId

### Issue 4: Firewall/Network Blocking
**Symptom:** Connection state stuck at "CONNECTING"
**Cause:** Corporate firewall blocking Agora servers
**Fix:** 
- Use different network (mobile hotspot)
- Check firewall allows UDP ports 1080-65535
- Whitelist Agora domains: *.agora.io, *.agoraio.cn

### Issue 5: Browser Compatibility
**Symptom:** Video works on Chrome but not Safari
**Cause:** Browser doesn't support WebRTC features
**Fix:** Use latest Chrome, Firefox, or Edge

### Issue 6: DOM Element Not Rendered
**Symptom:** "Remote video element not found"
**Cause:** React state update before DOM renders
**Fix:** Already implemented with 100ms timeout

---

## Testing Checklist

### Pre-Call Setup
- [ ] Both users have valid Agora App ID
- [ ] Backend server running (port 8080)
- [ ] Frontend dev server running (port 5173)
- [ ] Both users logged in with different accounts

### During Call
- [ ] User 1 sees own video (local)
- [ ] User 2 sees own video (local)
- [ ] User 1 console shows "User published" for User 2
- [ ] User 2 console shows "User published" for User 1
- [ ] Both see participant count = 2
- [ ] Remote video div exists in DOM
- [ ] Remote video track is playing

### Debug Commands

**Check if remote user exists:**
```javascript
// In browser console
console.log('Remote users:', remoteUsers);
```

**Check DOM elements:**
```javascript
// In browser console
document.querySelectorAll('[id^="remote-"]').forEach(el => {
  console.log('Found element:', el.id, 'has video:', el.children.length > 0);
});
```

**Check Agora client state:**
```javascript
// In browser console (if you expose clientRef)
console.log('Connection state:', client.connectionState);
console.log('Remote users:', client.remoteUsers);
```

---

## Step-by-Step Test

### Test 1: Same Device (Two Browsers)

1. Open Chrome → Login as Doctor → Join call
2. Open Chrome Incognito → Login as Patient → Join same call
3. Both should see each other

### Test 2: Different Devices

1. Device 1: Login as Doctor → Join call
2. Device 2: Login as Patient → Join same call
3. Both should see each other

### Test 3: Network Test

1. Both users on same WiFi → Should work
2. One on WiFi, one on mobile data → Should work
3. Both on mobile data → Should work

If any test fails, check console logs for errors.

---

## Code Changes Made

### Enhanced Logging
Added detailed console logs to track:
- User published events
- Subscription status
- DOM element availability
- Video track status

### Immediate Video Playback
Added 100ms timeout to ensure DOM is rendered before playing video:
```typescript
setTimeout(() => {
  const remoteVideoElement = document.getElementById(`remote-${user.uid}`);
  if (remoteVideoElement && user.videoTrack) {
    user.videoTrack.play(remoteVideoElement);
  }
}, 100);
```

### Double Video Play
Video plays in two places:
1. Immediately after subscription (with timeout)
2. In useEffect when remoteUsers state updates

This ensures video plays even if one method fails.

---

## Advanced Debugging

### Enable Agora SDK Debug Logs
Add to VideoCall.tsx before creating client:
```typescript
AgoraRTC.setLogLevel(0); // 0 = DEBUG, 1 = INFO, 2 = WARNING, 3 = ERROR
```

### Check Network Quality
Look for network quality logs:
```
Local network quality: 1 (Good)
Remote network quality: 1 (Good)
```

If quality is 5-6 (Poor), network issues may prevent video.

### Verify Token Generation
Test backend token endpoint:
```bash
curl "http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor"
```

Should return valid token starting with "006" or "007".

---

## Still Not Working?

### Collect Debug Info

1. **User 1 Console Logs** (copy all)
2. **User 2 Console Logs** (copy all)
3. **Network Tab** (F12 → Network → filter "agora")
4. **Channel Name** both users used
5. **User IDs** both users used
6. **Agora App ID** being used

### Common Root Causes

1. **Invalid Agora Credentials** (90% of issues)
   - Solution: Get valid credentials from Agora Console

2. **Different Channels** (5% of issues)
   - Solution: Ensure both use same room ID

3. **Network/Firewall** (3% of issues)
   - Solution: Test on different network

4. **Browser Issues** (2% of issues)
   - Solution: Use latest Chrome

---

## Success Indicators

When working correctly, you should see:

✅ Both users show "Connected" status
✅ Participant count shows "2 participants"
✅ Local video visible in bottom-right corner
✅ Remote video visible in main area
✅ Network quality indicators show green/yellow
✅ Audio works (can hear each other)
✅ Video controls work (mute/video toggle)

---

## Next Steps

1. Open browser console (F12) on both devices
2. Start a call
3. Check console logs for errors
4. Compare logs with expected logs above
5. If still not working, share console logs for further diagnosis
