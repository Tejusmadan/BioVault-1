# BioVault Mobile App - Setup Guide

Complete setup instructions for the BioVault mobile application.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Run on your device or simulator
npm run ios     # iOS (Mac only)
npm run android # Android
```

## Detailed Setup

### 1. Prerequisites

Install the required software:

```bash
# Install Node.js (v14+)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
```

### 2. Install Dependencies

```bash
cd mobile-app
npm install
```

This will install all required packages including:
- Expo SDK
- React Navigation
- Biometric authentication libraries
- QR code scanner
- WebSocket client
- And more...

### 3. Backend Configuration

The app needs to connect to the BioVault backend server.

**Option A: Local Development (Default)**

If running the backend locally on your computer:

1. Ensure the backend is running on `http://localhost:3001`
2. If testing on a physical device, update the API URL in `utils/api.js`:

```javascript
// Replace localhost with your computer's local IP address
const API_BASE_URL = 'http://192.168.1.XXX:3001';
```

To find your local IP:
- **Mac/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`

**Option B: Production/Remote Server**

Update `utils/api.js` with your server URL:

```javascript
const API_BASE_URL = 'https://your-backend-server.com';
```

### 4. Run on iOS (Mac Only)

```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Start iOS simulator
npm run ios
```

**Requirements:**
- macOS
- Xcode (from App Store)
- Xcode Command Line Tools

### 5. Run on Android

```bash
npm run android
```

**Requirements:**
- Android Studio
- Android SDK
- Android Emulator configured

**Setup Android Emulator:**
1. Open Android Studio
2. Go to AVD Manager (Tools > AVD Manager)
3. Create a new virtual device
4. Select a device with API level 29 or higher
5. Start the emulator before running `npm run android`

### 6. Run on Physical Device

**Recommended for testing biometric features**

#### iOS Device:
1. Install "Expo Go" from App Store
2. Run `npm start`
3. Scan QR code with Camera app
4. App opens in Expo Go

#### Android Device:
1. Install "Expo Go" from Play Store
2. Run `npm start`
3. Scan QR code with Expo Go app
4. App opens in Expo Go

**Important**: Ensure your device and computer are on the same WiFi network.

### 7. Enable Biometric Authentication

#### iOS:
- **Face ID**: Go to Settings > Face ID & Passcode > Add Face
- **Touch ID**: Go to Settings > Touch ID & Passcode > Add Fingerprint

#### Android:
- Go to Settings > Security > Biometric preferences
- Set up Fingerprint or Face unlock

### 8. Testing the Complete Flow

#### Step 1: Start Backend
```bash
cd ../backend
npm start
```

#### Step 2: Start Mobile App
```bash
cd ../mobile-app
npm start
```

#### Step 3: Start Web Dashboard
```bash
cd ../web-dashboard
npm start
```

#### Step 4: Pair Device
1. Open web dashboard in browser
2. Go to Settings > Devices > Add Mobile Device
3. QR code appears
4. Open mobile app
5. Scan QR code
6. Complete biometric authentication
7. Device is now paired

#### Step 5: Test Authentication
1. Install browser extension
2. Go to a website with saved credentials
3. Click login
4. Mobile app receives notification
5. Open notification
6. Review login details
7. Approve with biometric authentication
8. Login completes in browser

## Common Issues & Solutions

### Issue: "Unable to resolve module"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### Issue: "Camera permission denied"

**Solution:**
- iOS: Settings > BioVault > Enable Camera
- Android: Settings > Apps > BioVault > Permissions > Camera

### Issue: "Biometric authentication not available"

**Solution:**
- Ensure biometrics are set up on device
- Test on physical device (simulators have limited support)
- Check app permissions for biometric access

### Issue: "Cannot connect to backend"

**Solution:**
1. Verify backend is running
2. Check API_BASE_URL in `utils/api.js`
3. For physical devices, use computer's local IP instead of localhost
4. Ensure firewall allows connections on port 3001
5. Check both devices are on same network

### Issue: "Metro bundler won't start"

**Solution:**
```bash
# Kill existing Metro processes
pkill -f "cli.js start"

# Clear watchman (if installed)
watchman watch-del-all

# Restart
npm start
```

### Issue: "WebSocket connection failing"

**Solution:**
1. Check backend WebSocket server is running
2. Verify API URL includes correct protocol (ws:// or wss://)
3. Check network connectivity
4. Review backend logs for connection errors

### Issue: "QR Scanner shows black screen"

**Solution:**
1. Grant camera permissions
2. Restart app
3. Test camera in device's native camera app
4. Check for camera hardware issues

## Environment Variables

For production builds, create a `.env` file:

```env
API_BASE_URL=https://api.biovault.com
WEBSOCKET_URL=wss://api.biovault.com
ENVIRONMENT=production
```

Install `react-native-dotenv`:
```bash
npm install react-native-dotenv
```

Configure in `babel.config.js`:
```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ]
};
```

Use in code:
```javascript
import { API_BASE_URL } from '@env';
```

## Building for Production

### iOS Build

```bash
# Build for App Store
expo build:ios

# Configure app signing in Expo
# Follow prompts for Apple Developer credentials
```

### Android Build

```bash
# Build APK
expo build:android -t apk

# Build App Bundle (for Play Store)
expo build:android -t app-bundle
```

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Development Tips

### Hot Reloading
- Enable Fast Refresh in Expo Dev Tools
- Changes appear automatically as you code
- Shake device to open developer menu

### Debugging
- Use React Native Debugger
- Access via developer menu (Cmd+D on iOS, Cmd+M on Android)
- Console logs appear in terminal

### Testing Biometrics in Simulator
- iOS Simulator: Hardware > Touch ID / Face ID > Enrolled
- Android Emulator: Settings > Fingerprint (limited functionality)

### Network Debugging
```bash
# View network requests
npm install -g react-native-debugger
```

## Performance Optimization

### For Development:
- Use development build type
- Enable Fast Refresh
- Use USB debugging for Android

### For Production:
- Enable Hermes engine (app.json)
- Minimize bundle size
- Optimize images
- Use ProGuard for Android

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **Expo Forums**: https://forums.expo.dev/

## Next Steps

1. Complete the pairing flow
2. Test authentication requests
3. Customize the UI theme
4. Add app icons and splash screen
5. Configure push notifications
6. Prepare for app store submission

## Security Checklist

Before deploying:
- [ ] Update API URLs for production
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Implement certificate pinning
- [ ] Add ProGuard/obfuscation
- [ ] Review and minimize permissions
- [ ] Test on various devices
- [ ] Perform security audit
- [ ] Enable two-factor authentication
- [ ] Implement rate limiting
- [ ] Add error tracking (Sentry, etc.)

---

For additional help, refer to the main README.md or contact the development team.
