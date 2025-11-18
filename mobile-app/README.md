# BioVault Mobile App

React Native mobile application for BioVault password manager's biometric 2FA authentication system.

## Features

- **QR Code Pairing**: Scan QR codes to pair mobile device with BioVault
- **Biometric Authentication**: Support for fingerprint and Face ID authentication
- **Real-time Auth Requests**: WebSocket connection for instant authentication notifications
- **Push Notifications**: Receive alerts for login requests
- **Device Management**: View and manage paired devices
- **Secure Storage**: End-to-end encryption with local biometric data processing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Physical device for testing biometric features

## Installation

1. Navigate to the mobile-app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open Expo Dev Tools in your browser.

### Run on iOS Simulator (Mac only):
```bash
npm run ios
```

### Run on Android Emulator:
```bash
npm run android
```

### Run on Physical Device:

1. Install the Expo Go app on your iOS or Android device
2. Scan the QR code shown in the terminal or Expo Dev Tools
3. The app will load on your device

**Note**: Biometric authentication requires a physical device with fingerprint or Face ID capabilities.

## Configuration

### Backend API URL

The app connects to the backend API at `http://localhost:3001` by default. To change this:

1. Open `utils/api.js`
2. Modify the `API_BASE_URL` constant:
```javascript
const API_BASE_URL = 'YOUR_BACKEND_URL';
```

For production, you should use environment variables:

1. Create a `.env` file:
```
API_BASE_URL=https://your-production-api.com
```

2. Update `utils/api.js` to use the environment variable.

## Project Structure

```
mobile-app/
├── App.js                          # Main application entry point
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
├── package.json                    # Dependencies and scripts
├── components/
│   └── BiometricPrompt.js         # Biometric authentication component
├── screens/
│   ├── HomeScreen.js              # Main screen with device list
│   ├── PairingScreen.js           # QR scanner and pairing flow
│   └── AuthRequestScreen.js       # Authentication request handling
└── utils/
    └── api.js                     # API helper functions and WebSocket
```

## Key Components

### BiometricPrompt
Reusable component for biometric authentication with support for:
- Fingerprint authentication
- Face ID authentication
- PIN fallback
- Error handling and user feedback

### PairingScreen
Handles device pairing through:
- QR code scanning
- Manual code entry
- Biometric enrollment verification

### HomeScreen
Main dashboard showing:
- Connection status
- Paired devices
- Quick actions
- Security information

### AuthRequestScreen
Displays authentication requests with:
- Request details (browser, location, time)
- Approve/Deny actions
- Biometric verification for approval

## API Integration

The app communicates with the backend through:

### REST API Endpoints:
- `POST /api/pairing/verify` - Verify pairing code
- `POST /api/pairing/complete` - Complete pairing with biometric
- `POST /api/auth/approve` - Approve authentication request
- `POST /api/auth/deny` - Deny authentication request
- `GET /api/devices` - Get paired devices
- `DELETE /api/devices/:id` - Unpair device

### WebSocket Events:
- `connect` - Establish connection
- `auth-request` - Receive authentication requests
- `disconnect` - Handle disconnection

## Security Features

1. **Local Biometric Processing**: Biometric data never leaves the device
2. **Secure Storage**: Uses Expo SecureStore for sensitive data
3. **End-to-End Encryption**: Communication with backend is encrypted
4. **Token-Based Authentication**: JWT tokens for API requests
5. **Device Verification**: Each device must be explicitly paired

## Troubleshooting

### Camera Not Working
Ensure camera permissions are granted in device settings.

### Biometric Authentication Not Available
- Check that biometric authentication is set up on the device
- Verify that the app has biometric permissions
- Test on a physical device (simulators have limited biometric support)

### WebSocket Connection Issues
- Verify the backend server is running
- Check the API_BASE_URL configuration
- Ensure network connectivity

### Build Errors
```bash
# Clear Expo cache
expo start -c

# Clear node modules and reinstall
rm -rf node_modules
npm install
```

## Building for Production

### iOS (requires Mac):
```bash
expo build:ios
```

### Android:
```bash
expo build:android
```

Follow Expo's documentation for detailed build instructions and app store submission.

## Testing

### Test Pairing Flow:
1. Start the backend server
2. Open BioVault web dashboard
3. Go to Settings > Add Mobile Device
4. Scan QR code with mobile app
5. Complete biometric authentication

### Test Authentication Flow:
1. Ensure device is paired
2. Open browser extension
3. Attempt to log in to a website
4. Receive notification on mobile device
5. Approve/deny the authentication request

## Dependencies

Key dependencies:
- `expo` - Expo framework
- `react-native` - React Native framework
- `expo-local-authentication` - Biometric authentication
- `expo-barcode-scanner` - QR code scanning
- `expo-notifications` - Push notifications
- `socket.io-client` - WebSocket communication
- `axios` - HTTP client
- `@react-navigation/native` - Navigation
- `expo-secure-store` - Secure storage

## Contributing

When contributing to the mobile app:
1. Test on both iOS and Android devices
2. Verify biometric authentication on physical devices
3. Ensure proper error handling
4. Update documentation for new features
5. Follow React Native and Expo best practices

## Support

For issues or questions:
- Check the main BioVault repository README
- Review Expo documentation: https://docs.expo.dev/
- Test on physical devices for biometric features

## License

Part of the BioVault password manager project.
