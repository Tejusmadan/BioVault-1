# BioVault Production Deployment Guide

## Server Information
- **IP Address:** 192.168.2.244
- **Username:** sleep
- **Password:** _8Pu4@idRUSE

## Prerequisites

### On Your Local Machine
1. **Node.js** (v14 or later)
2. **npm** (v6 or later)
3. **sshpass** (for automated deployment)
   ```bash
   # macOS
   brew install hudochenkov/sshpass/sshpass

   # Ubuntu/Debian
   sudo apt-get install sshpass

   # CentOS/RHEL
   sudo yum install sshpass
   ```

### On the Server
The server should have the following installed:
1. **Node.js and npm**
2. **PM2** (Process Manager)
3. **Nginx** (Web Server)
4. **Git** (optional, for version control)

## Quick Deployment (Automated)

### Option 1: Using the Deployment Script

1. Navigate to the project root:
   ```bash
   cd "/Users/vanshyadav/Desktop/uss proj/BioVault-main"
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

The script will:
- Build the web dashboard
- Package all necessary files
- Upload to the server
- Install dependencies
- Configure PM2 and Nginx
- Start the application

### Option 2: Manual Deployment

If you prefer manual deployment, follow these steps:

## Manual Deployment Steps

### Step 1: Prepare the Application

1. **Build the web dashboard:**
   ```bash
   cd web-dashboard
   npm install
   npm run build
   cd ..
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install --production
   cd ..
   ```

### Step 2: Connect to the Server

```bash
ssh sleep@192.168.2.244
# Enter password: _8Pu4@idRUSE
```

### Step 3: Install Server Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 4: Create Deployment Directory

```bash
sudo mkdir -p /home/sleep/BioVault
sudo chown -R sleep:sleep /home/sleep/BioVault
```

### Step 5: Upload Files

From your local machine:

```bash
# Upload backend
scp -r backend sleep@192.168.2.244:/home/sleep/BioVault/

# Upload web dashboard build
scp -r web-dashboard/build sleep@192.168.2.244:/home/sleep/BioVault/web-dashboard

# Upload nginx configuration
scp nginx.conf sleep@192.168.2.244:/tmp/
```

### Step 6: Configure the Backend

SSH back into the server:

```bash
ssh sleep@192.168.2.244
cd /home/sleep/BioVault/backend

# Install dependencies
npm install --production

# Create logs directory
mkdir -p logs

# Create production environment file
cat > .env.production << 'EOF'
PORT=3001
JWT_SECRET=BioVault_Secure_JWT_Secret_Key_2024_Change_This_In_Production
NODE_ENV=production
ALLOWED_ORIGINS=http://192.168.2.244,http://192.168.2.244:80
EOF
```

### Step 7: Start the Backend with PM2

```bash
cd /home/sleep/BioVault/backend

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Copy and run the command that PM2 outputs
```

### Step 8: Configure Nginx

```bash
# Copy nginx configuration
sudo cp /tmp/nginx.conf /etc/nginx/sites-available/biovault

# Create symbolic link
sudo ln -sf /etc/nginx/sites-available/biovault /etc/nginx/sites-enabled/biovault

# Remove default configuration (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Accessing the Application

Once deployed, you can access:

- **Web Dashboard:** http://192.168.2.244
- **API Endpoint:** http://192.168.2.244/api
- **Health Check:** http://192.168.2.244/api/health

## Managing the Application

### PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs biovault-backend

# Restart application
pm2 restart biovault-backend

# Stop application
pm2 stop biovault-backend

# Monitor resources
pm2 monit
```

### Nginx Commands

```bash
# Check nginx status
sudo systemctl status nginx

# Reload nginx configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View nginx access logs
sudo tail -f /var/log/nginx/biovault-access.log

# View nginx error logs
sudo tail -f /var/log/nginx/biovault-error.log
```

### Application Logs

Backend logs are stored in:
- `/home/sleep/BioVault/backend/logs/out.log` - Standard output
- `/home/sleep/BioVault/backend/logs/error.log` - Error logs
- `/home/sleep/BioVault/backend/logs/combined.log` - Combined logs

```bash
# View backend logs
tail -f /home/sleep/BioVault/backend/logs/combined.log
```

## Updating the Application

### Quick Update

Run the deployment script again:
```bash
./deploy.sh
```

### Manual Update

1. Build the new version locally
2. Upload files to server
3. Restart PM2:
   ```bash
   pm2 restart biovault-backend
   ```

## Troubleshooting

### Backend Not Starting

1. Check PM2 logs:
   ```bash
   pm2 logs biovault-backend --lines 50
   ```

2. Check if port 3001 is already in use:
   ```bash
   sudo lsof -i :3001
   ```

3. Verify environment variables:
   ```bash
   cat /home/sleep/BioVault/backend/.env.production
   ```

### Nginx 502 Bad Gateway

1. Check if backend is running:
   ```bash
   pm2 status
   ```

2. Check nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/biovault-error.log
   ```

3. Verify nginx configuration:
   ```bash
   sudo nginx -t
   ```

### Cannot Connect to Server

1. Check if server is accessible:
   ```bash
   ping 192.168.2.244
   ```

2. Check if SSH is running:
   ```bash
   ssh sleep@192.168.2.244
   ```

3. Verify firewall rules allow ports 80 and 3001

### Database Issues

The application uses a local JSON file for data storage located at:
```
/home/sleep/BioVault/backend/data/vault.json
```

To reset the database:
```bash
rm /home/sleep/BioVault/backend/data/vault.json
pm2 restart biovault-backend
```

## Browser Extension Configuration

The browser extension needs to be updated to point to the production server.

**Update the API URL:**

Edit `browser-extension/background.js` line 2:
```javascript
const API_BASE_URL = 'http://192.168.2.244/api';
```

Then reload the extension in Chrome:
1. Go to `chrome://extensions`
2. Click the reload button on BioVault extension

## Mobile App Configuration

Update the mobile app to connect to the production backend:

Edit `mobile-app/src/config.js` (or wherever the API URL is defined):
```javascript
export const API_URL = 'http://192.168.2.244/api';
export const SOCKET_URL = 'http://192.168.2.244';
```

Then rebuild the app:
```bash
cd mobile-app
npx expo start --clear
```

## Security Considerations

1. **Change JWT Secret:** Update `JWT_SECRET` in `.env.production` to a strong, unique value

2. **HTTPS:** For production use, configure SSL/TLS certificates:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Firewall:** Configure UFW to allow only necessary ports:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS (if using SSL)
   sudo ufw enable
   ```

4. **Regular Updates:** Keep the system and dependencies updated:
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm update
   ```

## Backup and Recovery

### Backup Data

```bash
# Backup vault data
cp /home/sleep/BioVault/backend/data/vault.json ~/vault-backup-$(date +%Y%m%d).json

# Backup entire application
tar -czf ~/biovault-backup-$(date +%Y%m%d).tar.gz /home/sleep/BioVault
```

### Restore Data

```bash
# Restore vault data
cp ~/vault-backup-YYYYMMDD.json /home/sleep/BioVault/backend/data/vault.json
pm2 restart biovault-backend
```

## Performance Monitoring

### Set up PM2 Monitoring

```bash
# Enable PM2 web dashboard
pm2 web

# View real-time metrics
pm2 monit
```

### Monitor System Resources

```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Network connections
netstat -an | grep :3001
```

## Support and Maintenance

For issues or questions:
1. Check application logs
2. Review this deployment guide
3. Check PM2 and Nginx status
4. Verify server connectivity

## Summary

Your BioVault application should now be running in production at:
- **Web Interface:** http://192.168.2.244
- **Backend API:** http://192.168.2.244/api

The application is managed by PM2 and served through Nginx, providing a robust and scalable deployment.
