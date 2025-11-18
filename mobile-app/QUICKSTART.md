# BioVault Mobile App - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

Before you start, ensure you have:
- [ ] Node.js installed (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- [ ] npm or yarn package manager
- [ ] A smartphone (iOS or Android) with biometric capabilities
- [ ] Expo Go app installed on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 1-Minute Setup

### Step 1: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 2: Install Dependencies
```bash
cd mobile-app
npm install
```

### Step 3: Start the App
```bash
npm start
```

This opens Expo Dev Tools in your browser.

### Step 4: Run on Your Phone
1. Open **Expo Go** app on your phone
2. Scan the QR code from your terminal or browser
3. App loads on your device!

**Important**: Your phone and computer must be on the same WiFi network.

## Configure Backend Connection

The app needs to connect to the BioVault backend.

### If Backend is Running Locally

1. Find your computer's IP address:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

2. Open `utils/config.js` and update:
```javascript
development: {
  apiUrl: 'http://192.168.1.100:3001',  // Replace with YOUR IP
  wsUrl: 'ws://192.168.1.100:3001',
}
```

3. Restart the app:
```bash
# Press 'r' in the terminal where npm start is running
```

## Test the App

### Test 1: Pairing (Without Backend)
Even without the backend, you can test the UI:
1. App opens to "Pair Device" screen
2. Try scanning QR code (it won't verify without backend)
3. Try entering a manual code (e.g., "123456")
4. View the biometric authentication screen

### Test 2: Full Flow (With Backend)
1. Start the BioVault backend server
2. Open BioVault web dashboard
3. Go to Settings → Devices → "Add Mobile Device"
4. Scan QR code with mobile app
5. Complete biometric authentication
6. Device is paired!
7. Try logging in to a website to receive an auth request

## Common Quick Fixes

### "Cannot connect to Metro bundler"
```bash
# Kill any running processes
pkill -f "cli.js start"

# Restart
npm start
```

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### "Camera not working"
1. Go to your phone's Settings
2. Find BioVault app
3. Enable Camera permission
4. Restart the app

### "Biometric not available"
- Ensure biometrics are set up on your device
- Go to phone Settings → Security → Add fingerprint/Face ID
- Only works on physical devices (not simulators)

## Development Tips

### Fast Refresh
- Enabled by default
- Save file → Changes appear instantly
- No need to reload app

### Developer Menu
- **iOS**: Shake device or Cmd+D
- **Android**: Shake device or Cmd+M
- Options: Reload, Debug, Enable/Disable Fast Refresh

### View Logs
Terminal shows all console.log() output in real-time.

### Network Requests
Install React Native Debugger for detailed network inspection:
```bash
npm install -g react-native-debugger
```

## File Overview

Key files you might want to customize:

| File | Purpose | When to Edit |
|------|---------|--------------|
| `utils/config.js` | API URLs, settings | Change backend URL, colors |
| `App.js` | Navigation setup | Add new screens |
| `screens/HomeScreen.js` | Main dashboard | Customize UI |
| `components/BiometricPrompt.js` | Biometric auth | Customize auth flow |

## Next Steps

After quick start:
1. ✅ App is running on your device
2. ✅ Backend connection configured
3. ✅ Test pairing flow
4. ✅ Test authentication request flow
5. 📖 Read full [README.md](README.md) for detailed documentation
6. 🔧 Read [SETUP.md](SETUP.md) for advanced configuration
7. 🎨 Customize colors in `utils/config.js`
8. 🖼️ Add app icon and splash screen to `assets/`

## Getting Help

### Documentation
- **README.md**: Complete project documentation
- **SETUP.md**: Detailed setup instructions
- **PROJECT_SUMMARY.md**: Technical overview

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Docs](https://reactnative.dev/)

### Troubleshooting
See detailed troubleshooting in [SETUP.md](SETUP.md).

## Development Workflow

```bash
# Daily workflow
cd mobile-app
npm start
# Scan QR code with Expo Go
# Make changes → See updates instantly
# Test on device
# Commit changes
```

## Production Build (Later)

When ready to build for app stores:
```bash
# iOS
expo build:ios

# Android
expo build:android
```

See [SETUP.md](SETUP.md) for detailed build instructions.

---

## Summary Checklist

- [ ] Node.js and npm installed
- [ ] Expo CLI installed globally
- [ ] Dependencies installed (`npm install`)
- [ ] Expo Go app on phone
- [ ] Backend URL configured (if using backend)
- [ ] App running (`npm start`)
- [ ] QR code scanned and app loaded on phone
- [ ] Biometric authentication tested
- [ ] Pairing flow tested (optional without backend)

**Congratulations!** You're now running the BioVault mobile app. 🎉

For detailed features and configuration, see the full documentation in README.md.

---

**Time to complete:** 5 minutes
**Difficulty:** Beginner-friendly
**Requirements:** Node.js, smartphone with Expo Go
