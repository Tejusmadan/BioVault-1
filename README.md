# BioVault - Browser-Based Password Manager Prototype

A browser-based password manager with virtual biometric 2FA authentication.

## Project Structure

```
biovault-prototype/
├── browser-extension/     # Chrome/Firefox extension
├── web-dashboard/         # React web app for password management
├── backend/              # Node.js API server
├── mobile-app/           # React Native mobile app
└── README.md
```

## Features

- Browser extension with form detection and autofill
- Web dashboard with card-based password organization
- Encrypted password storage
- Virtual biometric 2FA via mobile app
- Cross-device synchronization
- Search and category management

## Quick Start

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Web Dashboard Setup
```bash
cd web-dashboard
npm install
npm start
```

### Browser Extension Setup
1. Open Chrome/Firefox
2. Go to Extensions page (chrome://extensions)
3. Enable Developer Mode
4. Click "Load unpacked"
5. Select the `browser-extension` folder

### Mobile App Setup
```bash
cd mobile-app
npm install
npx expo start
```

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: In-memory (prototype) / PostgreSQL (production)
- **Mobile**: React Native with Expo
- **Encryption**: Web Crypto API, AES-256-GCM
- **Real-time**: WebSocket for sync

## Security Features

- Client-side encryption
- Zero-knowledge architecture
- End-to-end encryption
- Biometric authentication via mobile
- Secure device pairing

## Development Status

This is a working prototype demonstrating core functionality:
- ✅ Password storage and retrieval
- ✅ Browser extension autofill
- ✅ Mobile biometric authentication
- ✅ Device pairing
- ✅ Basic sync functionality

## License

MIT License
