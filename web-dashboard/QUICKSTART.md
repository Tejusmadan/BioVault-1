# BioVault Web Dashboard - Quick Start Guide

## Prerequisites

Before running the web dashboard, ensure you have:
- Node.js (v14 or higher) installed
- The BioVault backend server running at `http://localhost:3001`

## Installation & Setup

### Step 1: Install Dependencies

Open a terminal in the web-dashboard directory and run:

```bash
npm install
```

This will install all required dependencies:
- React 18.2
- React DOM
- React Scripts (Create React App)
- Axios (for API calls)
- QRCode.react (for device pairing)

### Step 2: Start the Development Server

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## First Time Usage

### 1. Register an Account
- Click on the "Register" tab
- Enter your name, email, and password
- Click "Register" button
- You'll be redirected to login automatically

### 2. Login
- Enter your registered email and password
- Click "Login" button

### 3. Add Your First Password
- Click the "+ Add Password" button
- Fill in the details:
  - Title (e.g., "Facebook", "Gmail")
  - URL (website address)
  - Username/Email
  - Password (or click "Generate" for a secure password)
  - Category (Social, Banking, Email, etc.)
  - Notes (optional)
- Click "Add Password"

### 4. Manage Passwords
- **Search**: Use the search bar to find passwords
- **Filter**: Click category tags to filter by category
- **View**: Click the eye icon to show/hide passwords
- **Copy**: Click the clipboard icon to copy username or password
- **Edit**: Click the edit icon to modify a password
- **Delete**: Click the trash icon to remove a password

### 5. Pair a Mobile Device
- Click "Pair Device" button in the header
- Scan the QR code with the BioVault mobile app
- Follow the app instructions to complete pairing

## Features Overview

### Dashboard Statistics
View at a glance:
- Total number of saved passwords
- Number of categories used
- Passwords added this week

### Search & Filter
- Real-time search across titles, URLs, and usernames
- Category filtering (All, Social, Banking, Email, Work, Shopping, Entertainment, Other)

### Password Management
- Add new passwords with all necessary details
- Edit existing passwords
- Delete unwanted passwords
- Generate secure random passwords
- Toggle password visibility
- Quick copy to clipboard

### Security Features
- Passwords are masked by default
- JWT token-based authentication
- Secure API communication
- Auto-logout on token expiration

## Troubleshooting

### Backend Connection Issues
If you see "Failed to fetch passwords":
1. Ensure the backend server is running at `http://localhost:3001`
2. Check if the backend is accepting connections
3. Verify your authentication token is valid

### Login Issues
If login fails:
1. Verify you've registered an account first
2. Check your email and password are correct
3. Ensure the backend database is running

### Build Issues
If `npm install` fails:
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. Ensure you have Node.js v14 or higher

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment Options
- **Static Hosting**: Deploy the `build` folder to any static hosting service (Netlify, Vercel, GitHub Pages)
- **Docker**: Create a Docker container with nginx to serve the build
- **Traditional Server**: Upload the build folder to your web server

### Environment Configuration

For production, update the API_URL in:
- `src/components/Login.js`
- `src/components/Dashboard.js`
- `src/components/PairingModal.js`

Change from:
```javascript
const API_URL = 'http://localhost:3001/api';
```

To your production backend URL:
```javascript
const API_URL = 'https://your-backend-domain.com/api';
```

## Browser Support

The dashboard works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Need Help?

- Check the README.md for detailed documentation
- Review the backend API documentation
- Ensure all dependencies are properly installed

## Next Steps

1. Customize the theme colors in `src/App.css`
2. Add more password categories
3. Implement password strength indicators
4. Add two-factor authentication
5. Create password sharing features
6. Add password health checks

Enjoy using BioVault!
