# BioVault - Quick Start Guide

## Deploy to Production in 3 Steps

### Step 1: Install sshpass (if not already installed)

**macOS:**
```bash
brew install hudochenkov/sshpass/sshpass
```

**Ubuntu/Debian:**
```bash
sudo apt-get install sshpass
```

### Step 2: Navigate to Project Directory

```bash
cd "/Users/vanshyadav/Desktop/uss proj/BioVault-main"
```

### Step 3: Run Deployment Script

```bash
./deploy.sh
```

That's it! The script will automatically:
- ✓ Build the web dashboard
- ✓ Package all files
- ✓ Upload to server (192.168.2.244)
- ✓ Install dependencies
- ✓ Configure PM2 and Nginx
- ✓ Start the application

## Access Your Application

After deployment completes:

- **Web Dashboard:** http://192.168.2.244
- **Backend API:** http://192.168.2.244/api
- **Health Check:** http://192.168.2.244/api/health

## Update Browser Extension

After deployment, update the browser extension to use production API:

1. Edit `browser-extension/background.js` line 2:
   ```javascript
   const API_BASE_URL = 'http://192.168.2.244/api';
   ```

2. Reload extension in Chrome:
   - Go to `chrome://extensions`
   - Click reload button on BioVault

## Update Mobile App

Update mobile app configuration:

1. Edit API URL to point to production server
2. Rebuild and run:
   ```bash
   cd mobile-app
   npx expo start --clear
   ```

## Useful Commands

### Check Application Status
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

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed documentation.
