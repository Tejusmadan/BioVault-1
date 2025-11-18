# BioVault - Complete Setup Guide

This guide will walk you through setting up the entire BioVault password manager prototype system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Chrome or Firefox browser**
- **Android/iOS device** or emulator (for mobile app testing)
- **Expo Go app** (on mobile device) - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Project Structure

```
biovault-prototype/
├── backend/              # Node.js Express API server
├── web-dashboard/        # React web application
├── browser-extension/    # Chrome/Firefox extension
├── mobile-app/          # React Native mobile app
└── README.md
```

---

## Part 1: Backend Setup

The backend provides the API and WebSocket server for all components.

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express - Web server
- cors - Cross-origin support
- ws - WebSocket server
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- uuid - Unique ID generation
- dotenv - Environment variables

### Step 3: Configure Environment

The `.env` file is already created with defaults. You can modify it if needed:

```bash
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
Database initialized (in-memory)
BioVault server running on http://localhost:3001
WebSocket server running on ws://localhost:3001
```

**Test the server:**
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-..."}
```

---

## Part 2: Web Dashboard Setup

The web dashboard provides the full password management interface.

### Step 1: Open New Terminal

Keep the backend running and open a new terminal.

### Step 2: Navigate to Web Dashboard

```bash
cd web-dashboard
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- react & react-dom - React framework
- react-scripts - Build tooling
- axios - HTTP client
- qrcode.react - QR code generation

### Step 4: Start the Development Server

```bash
npm start
```

The dashboard will open automatically at `http://localhost:3000`

### Step 5: Test the Dashboard

1. Click "Don't have an account? Register here"
2. Enter any email and password (e.g., demo@biovault.com / password123)
3. Click "Register"
4. You'll be logged in and see the dashboard

**Demo Account:**
- Email: `demo@biovault.com`
- Password: Any password (authentication is simplified for prototype)

---

## Part 3: Browser Extension Setup

The browser extension provides form detection and autofill functionality.

### Step 1: Open Chrome/Firefox Extensions Page

**Chrome:** Navigate to `chrome://extensions/`
**Firefox:** Navigate to `about:debugging#/runtime/this-firefox`

### Step 2: Enable Developer Mode

**Chrome:** Toggle "Developer mode" in the top right
**Firefox:** Click "Load Temporary Add-on"

### Step 3: Load the Extension

**Chrome:**
1. Click "Load unpacked"
2. Navigate to `biovault-prototype/browser-extension`
3. Select the folder

**Firefox:**
1. Click "Load Temporary Add-on"
2. Navigate to `biovault-prototype/browser-extension`
3. Select `manifest.json`

### Step 4: Test the Extension

1. Click the BioVault icon in your browser toolbar
2. Login with: demo@biovault.com / any password
3. Visit any website with a login form (e.g., github.com/login)
4. You'll see a "Login with BioVault" button injected into the page

---

## Part 4: Mobile App Setup

The mobile app provides biometric 2FA authentication.

### Step 1: Navigate to Mobile App Directory

```bash
cd mobile-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- expo - React Native framework
- react-native - Core React Native
- expo-local-authentication - Biometric auth
- expo-barcode-scanner - QR code scanning
- socket.io-client - Real-time communication

### Step 3: Update Backend URL (Important!)

By default, the mobile app connects to `localhost:3001`. If testing on a physical device, you need to use your computer's IP address.

**Find your IP:**
- **Windows:** `ipconfig` (look for IPv4)
- **Mac/Linux:** `ifconfig` (look for inet)

**Update the configuration:**

Edit `mobile-app/utils/config.js`:

```javascript
// Change this line:
API_BASE_URL: 'http://localhost:3001',

// To your IP address:
API_BASE_URL: 'http://192.168.1.100:3001', // Replace with your IP
```

### Step 4: Start the Mobile App

```bash
npx expo start
```

Or simply:
```bash
npm start
```

You'll see a QR code in the terminal.

### Step 5: Test on Device

**Option A: Physical Device**
1. Install "Expo Go" app from App Store/Play Store
2. Scan the QR code with your camera (iOS) or Expo Go (Android)
3. The app will load on your device

**Option B: Emulator**
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator

### Step 6: Test Biometric Authentication

1. In the mobile app, tap "Pair New Device"
2. Allow camera permissions
3. Scan a pairing QR code from the web dashboard
4. Complete biometric authentication

---

## Complete Workflow Test

Now that everything is running, let's test the complete flow:

### Test 1: Register and Login

1. **Web Dashboard** (http://localhost:3000)
   - Register: demo@biovault.com / password123
   - You'll be logged into the dashboard

2. **Browser Extension**
   - Click the BioVault icon
   - Login with the same credentials
   - The popup shows "Welcome, demo@biovault.com"

### Test 2: Save a Password

1. **Visit a login page** (e.g., github.com/login)
2. Notice the "Login with BioVault" button
3. Fill in username and password
4. Click submit
5. Extension will prompt to save the password
6. Click "Save"

### Test 3: View Saved Passwords

1. **Open Web Dashboard**
2. See the password card for GitHub
3. Try searching: Type "github" in search bar
4. Filter by category: Click "Development"

### Test 4: Device Pairing

1. **Web Dashboard**
   - Click "Pair Mobile Device" button
   - A QR code appears

2. **Mobile App**
   - Tap "Pair New Device"
   - Allow camera access
   - Scan the QR code
   - Complete biometric authentication (fingerprint/Face ID)
   - You'll see "Pairing successful!"

### Test 5: Biometric Authentication (Complete Flow)

1. **Browser Extension**
   - Visit a saved login page
   - Click "Login with BioVault" button
   - Extension requests biometric auth

2. **Mobile App**
   - Notification appears: "Authentication Request"
   - See details: Website, browser, time
   - Complete biometric auth
   - Tap "Approve"

3. **Browser Extension**
   - Credentials are auto-filled
   - You can now login

---

## Troubleshooting

### Backend Issues

**Problem:** Port 3001 already in use
```bash
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
- Change port in `backend/.env`
- Update all references in other components

**Problem:** CORS errors
```bash
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Backend already has CORS enabled
- Ensure backend is running
- Check browser console for actual error

### Web Dashboard Issues

**Problem:** Can't connect to backend
```
Network Error
```

**Solution:**
- Verify backend is running on http://localhost:3001
- Check `npm run dev` in backend terminal
- Test: `curl http://localhost:3001/api/health`

**Problem:** Port 3000 already in use
```
Something is already running on port 3000
```

**Solution:**
- Kill the process or use different port
- Set: `PORT=3001 npm start`

### Browser Extension Issues

**Problem:** Extension not loading
```
manifest file is missing or unreadable
```

**Solution:**
- Ensure `manifest.json` exists
- Check JSON syntax
- Try loading the folder again

**Problem:** Form detection not working

**Solution:**
- Check browser console for errors
- Refresh the page
- Ensure website has input fields with type="password"

### Mobile App Issues

**Problem:** Can't connect to backend from mobile device
```
Network request failed
```

**Solution:**
- Use your computer's IP, not localhost
- Ensure device and computer are on same Wi-Fi
- Check firewall settings
- Update `utils/config.js` with correct IP

**Problem:** Biometric authentication not available
```
Biometrics not available on this device
```

**Solution:**
- Ensure device has fingerprint/Face ID set up
- Check device settings
- Use PIN fallback option

**Problem:** QR code scanner not working
```
Camera permission denied
```

**Solution:**
- Allow camera permissions in device settings
- Restart the app
- Try manual code entry

---

## Development Tips

### Backend

**View logs:**
```bash
# Backend automatically logs all requests
```

**Reset database:**
```bash
# Restart the server (in-memory DB resets)
npm run dev
```

**Test API endpoints:**
```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@biovault.com","masterPassword":"password123"}'
```

### Web Dashboard

**Clear stored data:**
```javascript
// Open browser console
localStorage.clear()
// Refresh page
```

**Build for production:**
```bash
npm run build
# Creates optimized build in 'build/' folder
```

### Browser Extension

**View extension logs:**
1. Right-click extension icon
2. Select "Inspect popup"
3. View console logs

**Reload extension after changes:**
- Go to chrome://extensions
- Click reload icon on BioVault extension

### Mobile App

**Clear app cache:**
```bash
# Stop the app
# Clear Expo cache
npx expo start --clear
```

**View logs:**
```bash
# Logs appear automatically in terminal
# Or use: npx expo start --dev-client
```

---

## Next Steps

### For Development

1. **Add Real Database**
   - Replace in-memory storage with PostgreSQL
   - Implement database migrations
   - Add data persistence

2. **Enhance Security**
   - Implement proper encryption (AES-256-GCM)
   - Add end-to-end encryption
   - Secure key management
   - Add rate limiting

3. **Add Features**
   - Password generator in extension
   - Password strength indicator
   - Breach monitoring
   - Secure password sharing
   - Family vault features

4. **Improve UX**
   - Add onboarding flow
   - Implement settings page
   - Add dark mode
   - Improve animations

### For Production

1. **Security Audit**
   - Professional security review
   - Penetration testing
   - Compliance check (GDPR, etc.)

2. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Caching strategies
   - CDN integration

3. **Deployment**
   - Backend: AWS/Heroku/DigitalOcean
   - Web: Vercel/Netlify
   - Extension: Chrome Web Store, Firefox Add-ons
   - Mobile: App Store, Google Play

---

## Support & Resources

### Documentation
- Backend API: See `backend/README.md`
- Web Dashboard: See `web-dashboard/README.md`
- Mobile App: See `mobile-app/SETUP.md`

### Useful Commands

```bash
# Backend
cd backend && npm run dev

# Web Dashboard
cd web-dashboard && npm start

# Mobile App
cd mobile-app && npm start

# Install all dependencies at once (from project root)
cd backend && npm install && cd ../web-dashboard && npm install && cd ../mobile-app && npm install
```

---

## Congratulations!

You've successfully set up the complete BioVault password manager prototype. You now have:

- ✅ A working backend API with WebSocket support
- ✅ A beautiful web dashboard for password management
- ✅ A browser extension with form detection and autofill
- ✅ A mobile app with biometric authentication

**You're ready to start testing, developing, and customizing BioVault!**

For questions or issues, refer to the troubleshooting section or check individual component README files.
