# 🔐 BioVault - Production Deployment Ready

**A secure password manager with biometric authentication**

---

## 🎯 You're Ready to Deploy!

BioVault is now **fully configured** for production deployment on your VM.

### Server Information
- **IP:** 192.168.2.244
- **User:** sleep
- **Deploy Path:** /home/sleep/BioVault

---

## 🚀 Quick Deploy (3 Steps)

### 1. Install sshpass
```bash
# macOS
brew install hudochenkov/sshpass/sshpass

# Ubuntu/Debian
sudo apt-get install sshpass
```

### 2. Navigate to Project
```bash
cd "/Users/vanshyadav/Desktop/uss proj/BioVault-main"
```

### 3. Deploy!
```bash
./deploy.sh
```

**That's it!** The script handles everything automatically.

---

## 📋 What Gets Deployed

### Backend (Node.js + Express)
- REST API on port 3001
- JWT authentication
- Password management
- WebSocket support (Socket.IO)
- PM2 process management

### Web Dashboard (React)
- User interface at port 80
- Password vault management
- Device pairing via QR codes
- Real-time sync

### Nginx
- Reverse proxy
- Static file serving
- WebSocket proxying

---

## 🌐 Access Your Application

After deployment:

| Component | URL |
|-----------|-----|
| **Web Dashboard** | http://192.168.2.244 |
| **API** | http://192.168.2.244/api |
| **Health Check** | http://192.168.2.244/api/health |

---

## 📱 Update Other Components

### Browser Extension

Edit `browser-extension/background.js` (line 2):
```javascript
const API_BASE_URL = 'http://192.168.2.244/api';
```

Then reload the extension in Chrome (`chrome://extensions`).

### Mobile App

Update the API configuration to use the production server:
```javascript
API_URL: 'http://192.168.2.244/api'
SOCKET_URL: 'http://192.168.2.244'
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **QUICK_START.md** | 3-step deployment guide |
| **DEPLOYMENT.md** | Comprehensive deployment documentation |
| **PRODUCTION_READY.md** | Production setup overview |
| **deploy.sh** | Automated deployment script |

---

## 🛠️ Management Commands

### Check Status
```bash
ssh sleep@192.168.2.244
pm2 status
```

### View Logs
```bash
ssh sleep@192.168.2.244
pm2 logs biovault-backend
```

### Restart Application
```bash
ssh sleep@192.168.2.244
pm2 restart biovault-backend
```

---

## ✨ Features

- ✅ Password management (CRUD operations)
- ✅ JWT authentication
- ✅ Biometric authentication via mobile app
- ✅ Browser extension auto-fill
- ✅ Real-time sync across devices
- ✅ QR code device pairing
- ✅ Secure password storage
- ✅ Production-ready deployment
- ✅ Auto-restart with PM2
- ✅ Nginx reverse proxy
- ✅ Comprehensive logging

---

## 🏗️ Architecture

```
Browser Extension ──┐
                    ├──► Nginx (Port 80) ──► Backend (Port 3001) ──► vault.json
Web Dashboard ──────┤
                    │
Mobile App ─────────┘
```

---

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable configuration
- Input validation

---

## 📊 Monitoring

### Health Check
```bash
curl http://192.168.2.244/api/health
```

### Application Metrics
```bash
ssh sleep@192.168.2.244
pm2 monit
```

---

## 🆘 Troubleshooting

**Service not responding?**
```bash
ssh sleep@192.168.2.244
pm2 restart biovault-backend
```

**Check logs:**
```bash
ssh sleep@192.168.2.244
pm2 logs biovault-backend --lines 50
```

**Nginx issues:**
```bash
ssh sleep@192.168.2.244
sudo nginx -t
sudo systemctl status nginx
```

For detailed troubleshooting, see `DEPLOYMENT.md`.

---

## 💾 Backup

```bash
# Backup vault data
ssh sleep@192.168.2.244 'cp /home/sleep/BioVault/backend/data/vault.json ~/vault-backup-$(date +%Y%m%d).json'
```

---

## 🎓 Project Structure

```
BioVault-main/
├── backend/                 # Node.js API server
│   ├── server.js
│   ├── ecosystem.config.js  # PM2 configuration
│   └── .env.production      # Production environment
├── web-dashboard/           # React web app
│   ├── src/
│   │   └── config.js        # API URL configuration
│   └── build/               # Production build
├── browser-extension/       # Chrome extension
├── mobile-app/              # React Native app
├── nginx.conf               # Nginx configuration
├── deploy.sh                # Deployment script
├── DEPLOYMENT.md            # Full deployment guide
├── QUICK_START.md           # Quick start guide
└── PRODUCTION_READY.md      # Production overview
```

---

## 🎉 Ready to Go!

Your BioVault password manager is production-ready!

**Deploy now:**
```bash
./deploy.sh
```

**Access at:** http://192.168.2.244

---

**Built with ❤️ for secure password management**
