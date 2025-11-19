# BioVault - Complete Documentation Index

**Version:** 1.0.0  
**Last Updated:** November 2024

Welcome to the BioVault comprehensive documentation. This document serves as the central hub for all documentation related to the BioVault password manager project.

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture & Design](#architecture--design)
3. [Component Documentation](#component-documentation)
4. [API Reference](#api-reference)
5. [User Guides](#user-guides)
6. [Developer Guides](#developer-guides)
7. [Deployment](#deployment)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

---

## 📖 Getting Started

### Quick Links
- **[README.md](README.md)** - Project overview and features
- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 steps
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions for all components

### What is BioVault?

BioVault is a browser-based password manager with virtual biometric 2FA authentication. The system consists of four main components:

1. **Backend Server** - Node.js/Express REST API
2. **Web Dashboard** - React-based user interface
3. **Browser Extension** - Chrome/Firefox extension for auto-fill
4. **Mobile App** - React Native app for biometric authentication

### Key Features
- ✅ Secure password storage with encryption
- ✅ Browser extension with auto-fill capabilities
- ✅ Biometric authentication via mobile device
- ✅ Cross-device synchronization
- ✅ Zero-knowledge architecture
- ✅ Device pairing with QR codes

---

## 🏗️ Architecture & Design

### Core Documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Comprehensive system architecture (19,500+ words)
  - System overview and component architecture
  - Data flow diagrams
  - Security architecture
  - Technology stack
  - Design patterns
  - Scalability considerations

### Key Architectural Concepts

#### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      BioVault System                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │     Web      │  │    Mobile    │      │
│  │  Extension   │  │  Dashboard   │  │     App      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  Backend API    │                        │
│                   │  + WebSocket    │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   Database      │                        │
│                   │  (PostgreSQL)   │                        │
│                   └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

#### Technology Stack

**Backend:**
- Node.js 16+ with Express 4.18
- WebSocket (ws 8.14) for real-time sync
- JWT + bcrypt for authentication
- In-memory/PostgreSQL database

**Frontend:**
- React 18.2 with TypeScript support
- Axios for HTTP requests
- QRCode.react for device pairing

**Mobile:**
- React Native 0.72 with Expo 49.0
- expo-local-authentication for biometrics
- Socket.IO for real-time communication

**Browser Extension:**
- Manifest V3 (Chrome/Firefox compatible)
- Content scripts for form detection
- Service worker for background tasks

---

## 📦 Component Documentation

### 1. Backend Server

**Documentation:**
- [backend/README.md](backend/README.md) - Backend overview
- [API_REFERENCE.md](API_REFERENCE.md) - Complete API documentation

**Structure:**
```
backend/
├── server.js           # Main server entry point
├── db.js              # Database abstraction layer
├── auth.js            # Authentication middleware
└── routes/
    ├── passwords.js   # Password CRUD operations
    ├── pairing.js     # Device pairing endpoints
    ├── devices.js     # Device management
    └── auth.js        # Auth requests
```

**Key Features:**
- RESTful API with JWT authentication
- WebSocket server for real-time sync
- Password vault storage and retrieval
- Device pairing coordination
- Biometric auth request handling

### 2. Web Dashboard

**Documentation:**
- [web-dashboard/README.md](web-dashboard/README.md) - Dashboard overview
- [web-dashboard/QUICKSTART.md](web-dashboard/QUICKSTART.md) - Quick start guide

**Structure:**
```
web-dashboard/
└── src/
    ├── App.js                      # Main application
    ├── config.js                   # Configuration
    └── components/
        ├── Login.js                # Authentication
        ├── Dashboard.js            # Main dashboard
        ├── PasswordCard.js         # Password cards
        ├── AddPasswordModal.js     # Add/edit modal
        └── PairingModal.js         # Device pairing
```

**Key Features:**
- User authentication (login/register)
- Password management (CRUD)
- Search and filtering
- Category organization
- Device pairing with QR code
- Statistics and analytics

### 3. Browser Extension

**Documentation:**
- [browser-extension/README.md](browser-extension/README.md) - Extension guide
- [browser-extension/CLEAR_CACHE_INSTRUCTIONS.md](browser-extension/CLEAR_CACHE_INSTRUCTIONS.md)

**Structure:**
```
browser-extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker
├── content.js         # Form detection
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
└── popup.css          # Styling
```

**Key Features:**
- Automatic login form detection
- Auto-fill credentials
- Save new passwords
- Quick access popup
- Biometric authentication support

### 4. Mobile App

**Documentation:**
- [mobile-app/README.md](mobile-app/README.md) - Mobile app overview
- [mobile-app/SETUP.md](mobile-app/SETUP.md) - Detailed setup guide (7,700+ words)
- [mobile-app/QUICKSTART.md](mobile-app/QUICKSTART.md) - Quick start
- [mobile-app/PROJECT_SUMMARY.md](mobile-app/PROJECT_SUMMARY.md) - Technical overview

**Structure:**
```
mobile-app/
├── App.js                        # Main entry point
├── screens/
│   ├── PairingScreen.js         # QR code scanning
│   ├── HomeScreen.js            # Main dashboard
│   └── AuthRequestScreen.js     # Auth approval
├── components/
│   └── BiometricPrompt.js       # Biometric auth
└── utils/
    ├── api.js                    # API integration
    └── config.js                 # Configuration
```

**Key Features:**
- QR code scanning for device pairing
- Biometric authentication (fingerprint/Face ID)
- Receive and approve auth requests
- Manage paired devices
- Push notifications

---

## 🔌 API Reference

**Complete Documentation:** [API_REFERENCE.md](API_REFERENCE.md)

### Authentication Endpoints
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
```

### Password Management
```
GET    /api/passwords              # Get all passwords
GET    /api/passwords/:id          # Get specific password
POST   /api/passwords              # Create new password
PUT    /api/passwords/:id          # Update password
DELETE /api/passwords/:id          # Delete password
```

### Device Pairing
```
POST   /api/pairing/request        # Request pairing code
POST   /api/pairing/verify         # Verify pairing code
POST   /api/pairing/complete       # Complete pairing
GET    /api/devices                # Get paired devices
DELETE /api/devices/:id            # Unpair device
```

### Biometric Authentication
```
POST   /api/auth/biometric/request      # Request biometric auth
POST   /api/auth/biometric/approve      # Approve auth request
POST   /api/auth/biometric/deny         # Deny auth request
```

### WebSocket Events
- `connect` - Client connection
- `sync` - Password synchronization
- `auth_request` - Biometric auth request
- `auth_approved` - Auth approved
- `pair_request` - Device pairing

---

## 👥 User Guides

### For End Users

1. **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user guide
   - Getting started
   - Creating an account
   - Adding passwords
   - Using the browser extension
   - Pairing your mobile device
   - Using biometric authentication

2. **Web Dashboard Guide**
   - Navigating the dashboard
   - Managing passwords
   - Organizing with categories
   - Search and filtering
   - Security best practices

3. **Browser Extension Guide**
   - Installing the extension
   - Logging in
   - Auto-filling passwords
   - Saving new passwords
   - Managing credentials

4. **Mobile App Guide**
   - Setting up the mobile app
   - Pairing with your account
   - Approving authentication requests
   - Managing biometric settings

---

## 💻 Developer Guides

### Setup & Development

1. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup guide
   - Prerequisites
   - Backend setup
   - Web dashboard setup
   - Browser extension setup
   - Mobile app setup
   - Testing workflows

2. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Development guide
   - Development environment setup
   - Project structure
   - Coding standards
   - Testing guidelines
   - Debugging tips
   - Common patterns

### Component-Specific Development

- **Backend Development**
  - Setting up the development environment
  - Database schema
  - API development
  - WebSocket implementation
  - Authentication flow

- **Frontend Development**
  - React component development
  - State management
  - API integration
  - Styling guidelines
  - Testing components

- **Extension Development**
  - Chrome extension architecture
  - Content script development
  - Background script development
  - Debugging extensions

- **Mobile Development**
  - React Native development
  - Expo workflow
  - Biometric integration
  - Platform-specific features

---

## 🚀 Deployment

### Deployment Documentation

1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide (8,400+ words)
   - Prerequisites
   - Quick deployment (automated)
   - Manual deployment steps
   - Server configuration
   - Managing the application
   - Troubleshooting

2. **[QUICK_START.md](QUICK_START.md)** - Deploy in 3 steps
   - Quick deployment script
   - Access URLs
   - Component updates

3. **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Production readiness checklist
   - Configuration details
   - Architecture overview
   - Deployment options

4. **[VM_DEPLOYMENT_SUMMARY.md](VM_DEPLOYMENT_SUMMARY.md)** - VM-specific deployment
   - Server details
   - Running services
   - Component configuration
   - Management commands

### Deployment Options

#### Option 1: Automated Deployment
```bash
# Install sshpass
brew install hudochenkov/sshpass/sshpass

# Navigate to project
cd /path/to/BioVault-1

# Deploy
./deploy.sh
```

#### Option 2: Docker Deployment (Coming Soon)
```bash
docker-compose up -d
```

#### Option 3: Cloud Deployment
- AWS/EC2
- Heroku
- DigitalOcean
- Vercel (frontend)

### Environment Configuration

**Development:**
```
Backend:  http://localhost:3001
Web:      http://localhost:3000
Mobile:   Expo Go (local network)
```

**Production:**
```
Backend:  http://192.168.2.244/api
Web:      http://192.168.2.244
Mobile:   Configure API URL in config.js
```

---

## 🔒 Security

### Security Documentation

1. **[SECURITY.md](SECURITY.md)** - Security documentation
   - Security architecture
   - Encryption details
   - Authentication mechanisms
   - Best practices
   - Threat model
   - Security auditing

2. **Security Features**
   - Client-side encryption
   - Zero-knowledge architecture
   - JWT token authentication
   - Password hashing (bcrypt)
   - Biometric authentication
   - Secure WebSocket communication
   - CORS protection

3. **Security Best Practices**
   - Master password requirements
   - Token management
   - Secure storage
   - Device management
   - Regular updates

### Reporting Security Issues

If you discover a security vulnerability, please email: security@biovault.com (or create a private issue)

Do NOT create public issues for security vulnerabilities.

---

## 🔧 Troubleshooting

### Troubleshooting Documentation

1. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Comprehensive troubleshooting guide
   - Common issues and solutions
   - Backend issues
   - Frontend issues
   - Extension issues
   - Mobile app issues
   - Network issues
   - Build issues

2. **[FIXES.md](FIXES.md)** - Known issues and fixes
   - Bug fixes applied
   - Workarounds
   - Known limitations

### Quick Troubleshooting

**Backend not starting:**
```bash
# Check if port is in use
lsof -i :3001

# Check logs
pm2 logs biovault-backend
```

**Frontend build issues:**
```bash
# Clear cache and rebuild
cd web-dashboard
rm -rf node_modules build
npm install
npm run build
```

**Extension not working:**
```bash
# Reload extension
chrome://extensions/ -> Click reload button
```

**Mobile app connection issues:**
```bash
# Ensure on same network
# Check API URL in config.js
# Restart Expo with cache clear
npx expo start --clear
```

---

## 🤝 Contributing

### Contributing Documentation

1. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines
   - How to contribute
   - Code of conduct
   - Development workflow
   - Pull request process
   - Coding standards
   - Testing requirements

2. **Development Workflow**
   ```
   1. Fork the repository
   2. Create a feature branch
   3. Make your changes
   4. Write/update tests
   5. Update documentation
   6. Submit pull request
   ```

3. **Coding Standards**
   - ESLint configuration
   - Prettier formatting
   - Naming conventions
   - Comment guidelines
   - Commit message format

### Project Roadmap

**Phase 1: Core Features** ✅ Complete
- Password management
- Browser extension
- Mobile biometric auth
- Device pairing
- Real-time sync

**Phase 2: Enhanced Security** 🚧 In Progress
- End-to-end encryption
- Zero-knowledge implementation
- Hardware security key support
- Security audit

**Phase 3: User Experience** 📋 Planned
- Password health score
- Breach monitoring
- Password sharing
- Family vault
- Browser history detection

**Phase 4: Enterprise** 📋 Planned
- SSO integration
- Admin dashboard
- User provisioning
- Compliance reports
- Active Directory integration

---

## 📊 Project Statistics

### Code Metrics
- **Total Lines of Code:** ~15,000+
- **Components:** 4 main components
- **Documentation:** 35,000+ words
- **API Endpoints:** 15+
- **React Components:** 10+

### File Structure
```
BioVault-1/
├── backend/                 # 800+ lines
├── web-dashboard/          # 5,500+ lines
├── browser-extension/      # 2,000+ lines
├── mobile-app/            # 2,150+ lines
├── Documentation/         # 35,000+ words
└── Configuration files
```

---

## 📝 Documentation Index

### Core Documentation
- ✅ README.md - Project overview
- ✅ ARCHITECTURE.md - System architecture
- ✅ PROJECT_SUMMARY.md - Project summary
- ✅ SETUP_GUIDE.md - Setup instructions
- ✅ DOCUMENTATION.md - This file (master index)

### Deployment
- ✅ DEPLOYMENT.md - Deployment guide
- ✅ QUICK_START.md - Quick start
- ✅ PRODUCTION_READY.md - Production setup
- ✅ VM_DEPLOYMENT_SUMMARY.md - VM deployment
- ✅ README_DEPLOYMENT.md - Deployment overview

### Component-Specific
- ✅ backend/README.md
- ✅ web-dashboard/README.md
- ✅ web-dashboard/QUICKSTART.md
- ✅ browser-extension/README.md
- ✅ browser-extension/CLEAR_CACHE_INSTRUCTIONS.md
- ✅ mobile-app/README.md
- ✅ mobile-app/SETUP.md
- ✅ mobile-app/QUICKSTART.md
- ✅ mobile-app/PROJECT_SUMMARY.md

### Additional Documentation (New)
- ⭐ API_REFERENCE.md - Complete API documentation
- ⭐ USER_GUIDE.md - End-user guide
- ⭐ DEVELOPER_GUIDE.md - Developer guide
- ⭐ SECURITY.md - Security documentation
- ⭐ TROUBLESHOOTING.md - Troubleshooting guide
- ⭐ CONTRIBUTING.md - Contributing guidelines

---

## 🔗 Quick Links

### For Users
- [Getting Started](SETUP_GUIDE.md)
- [User Guide](USER_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)

### For Developers
- [Setup Guide](SETUP_GUIDE.md)
- [Developer Guide](DEVELOPER_GUIDE.md)
- [API Reference](API_REFERENCE.md)
- [Contributing](CONTRIBUTING.md)

### For DevOps
- [Deployment Guide](DEPLOYMENT.md)
- [Quick Start](QUICK_START.md)
- [Production Setup](PRODUCTION_READY.md)

### For Security Researchers
- [Security Documentation](SECURITY.md)
- [Architecture](ARCHITECTURE.md)

---

## 📞 Support & Contact

### Getting Help
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Search existing [GitHub Issues](https://github.com/Tejusmadan/BioVault-1/issues)
3. Create a new issue with the appropriate template
4. Contact the team (if applicable)

### Community
- GitHub Discussions
- Issue Tracker
- Pull Requests

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

Built with:
- Node.js, Express
- React, React Native
- Expo
- Chrome Extension APIs
- And many open-source libraries

---

**Last Updated:** November 2024  
**Documentation Version:** 1.0.0  
**Project Version:** 1.0.0

For the most up-to-date documentation, visit: [GitHub Repository](https://github.com/Tejusmadan/BioVault-1)
