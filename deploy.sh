#!/bin/bash

# BioVault Deployment Script
# This script automates the deployment of BioVault to a production server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="192.168.2.244"
SERVER_USER="sleep"
SERVER_PASSWORD="_8Pu4@idRUSE"
DEPLOY_PATH="/home/sleep/BioVault"

echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   BioVault Production Deployment     ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${YELLOW}► $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    print_error "sshpass is not installed. Please install it first:"
    echo "  macOS: brew install hudochenkov/sshpass/sshpass"
    echo "  Ubuntu/Debian: sudo apt-get install sshpass"
    echo "  CentOS/RHEL: sudo yum install sshpass"
    exit 1
fi

print_step "Building web dashboard..."
cd web-dashboard
npm run build
print_success "Web dashboard built successfully"

cd ..

print_step "Creating deployment package..."
mkdir -p deploy-package
cp -r backend deploy-package/
cp -r web-dashboard/build deploy-package/web-dashboard
cp nginx.conf deploy-package/
print_success "Deployment package created"

print_step "Connecting to server and deploying..."

# Create deployment archive
tar -czf biovault-deploy.tar.gz deploy-package

# Upload to server
sshpass -p "${SERVER_PASSWORD}" scp biovault-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

# Execute deployment on server
sshpass -p "${SERVER_PASSWORD}" ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "Extracting deployment package..."
cd /tmp
tar -xzf biovault-deploy.tar.gz

echo "Stopping existing services..."
pm2 stop biovault-backend || true

echo "Creating deployment directory..."
sudo mkdir -p /home/sleep/BioVault
sudo chown -R sleep:sleep /home/sleep/BioVault

echo "Moving files to deployment directory..."
cp -r deploy-package/backend/* /home/sleep/BioVault/backend/
cp -r deploy-package/web-dashboard /home/sleep/BioVault/

echo "Installing backend dependencies..."
cd /home/sleep/BioVault/backend
npm install --production

echo "Creating logs directory..."
mkdir -p logs

echo "Setting up environment..."
if [ ! -f .env.production ]; then
    echo "Creating production environment file..."
    cat > .env.production << 'EOF'
PORT=3001
JWT_SECRET=BioVault_Secure_JWT_Secret_Key_2024_Change_This_In_Production
NODE_ENV=production
ALLOWED_ORIGINS=http://192.168.2.244,http://192.168.2.244:80
EOF
fi

echo "Starting backend with PM2..."
pm2 start ecosystem.config.js || pm2 restart biovault-backend

echo "Configuring Nginx..."
sudo cp /tmp/deploy-package/nginx.conf /etc/nginx/sites-available/biovault
sudo ln -sf /etc/nginx/sites-available/biovault /etc/nginx/sites-enabled/biovault
sudo nginx -t && sudo systemctl reload nginx

echo "Cleaning up..."
rm -rf /tmp/biovault-deploy.tar.gz /tmp/deploy-package

echo "Deployment completed successfully!"
pm2 save
ENDSSH

print_success "Deployment completed!"

# Cleanup local files
rm -rf deploy-package biovault-deploy.tar.gz

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      Deployment Summary               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo "  Web Dashboard: http://${SERVER_IP}"
echo "  Backend API:   http://${SERVER_IP}/api"
echo ""
echo "  SSH Access:    ssh ${SERVER_USER}@${SERVER_IP}"
echo "  PM2 Status:    pm2 status"
echo "  PM2 Logs:      pm2 logs biovault-backend"
echo ""
print_success "BioVault is now running in production!"
