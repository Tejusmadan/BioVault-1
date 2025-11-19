# BioVault User Guide

**Welcome to BioVault!** This guide will help you get started with BioVault, a secure password manager with biometric authentication.

---

## Table of Contents

1. [What is BioVault?](#what-is-biovault)
2. [Getting Started](#getting-started)
3. [Creating Your Account](#creating-your-account)
4. [Web Dashboard Guide](#web-dashboard-guide)
5. [Browser Extension Guide](#browser-extension-guide)
6. [Mobile App Guide](#mobile-app-guide)
7. [Managing Your Passwords](#managing-your-passwords)
8. [Device Pairing](#device-pairing)
9. [Biometric Authentication](#biometric-authentication)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting](#troubleshooting)
12. [FAQ](#faq)

---

## What is BioVault?

BioVault is a modern password manager that helps you:
- 🔒 **Store passwords securely** - All passwords are encrypted
- 🌐 **Auto-fill on websites** - Automatic form filling in your browser
- 📱 **Use biometric authentication** - Unlock with fingerprint or Face ID
- 🔄 **Sync across devices** - Access your passwords everywhere
- 🛡️ **Stay secure** - Zero-knowledge encryption keeps your data private

### How It Works

1. **Store** - Save your passwords in the secure vault
2. **Access** - Use the web dashboard, browser extension, or mobile app
3. **Auto-fill** - Automatically fill login forms on websites
4. **Verify** - Approve logins with your fingerprint or Face ID

---

## Getting Started

### What You'll Need

- **Computer** with Chrome or Firefox browser
- **Smartphone** (optional, for biometric authentication)
- **Internet connection**

### Installation Steps

1. **Access the Web Dashboard**
   - Open your browser
   - Navigate to `http://192.168.2.244` (or your deployment URL)
   
2. **Install Browser Extension** (Optional)
   - Download the extension from the Chrome Web Store
   - Or load it manually (see Extension Guide)

3. **Install Mobile App** (Optional)
   - Download the Expo Go app
   - Scan the QR code to open BioVault
   - Or download from App Store/Google Play (coming soon)

---

## Creating Your Account

### Step 1: Register

1. Open the web dashboard
2. Click **"Create Account"** or **"Sign Up"**
3. Enter your email address
4. Create a strong master password
5. Click **"Register"**

### Master Password Requirements

Your master password should be:
- ✅ At least 8 characters long
- ✅ Mix of uppercase and lowercase letters
- ✅ Include numbers and special characters
- ✅ Not used on any other website
- ✅ Easy for you to remember

**Important:** Your master password is the key to all your data. Store it securely and never share it with anyone.

### Step 2: First Login

1. Enter your email
2. Enter your master password
3. Click **"Login"**

You'll be taken to your dashboard where you can start adding passwords.

---

## Web Dashboard Guide

### Dashboard Overview

The web dashboard is your central hub for managing passwords.

#### Main Sections

1. **Search Bar** - Quickly find any password
2. **Category Filter** - Filter by category
3. **Password Cards** - Visual display of all passwords
4. **Add Button** - Create new password entries
5. **User Menu** - Settings and logout

### Navigating the Dashboard

#### Home Screen

When you log in, you'll see:
- **Search bar** at the top
- **Category buttons** below the search
- **Password cards** in a grid layout
- **Statistics** showing total passwords and categories

#### Password Cards

Each card displays:
- **Website icon** or favicon
- **Website name**
- **Username/email**
- **Category badge**
- **Favorite star** (if marked)
- **Action buttons** (view, edit, delete)

### Using the Search

1. Click the search bar at the top
2. Type any part of:
   - Website name
   - Username
   - Category
   - Notes
3. Results appear instantly

**Tips:**
- Search is case-insensitive
- Partial matches work
- Clear search to see all passwords

### Filtering by Category

Categories help organize your passwords:

**Default Categories:**
- 🌐 All (show everything)
- 💼 Work
- 🎮 Social
- 🛒 Shopping
- 🏦 Banking
- 📧 Email
- 🎵 Entertainment

**To filter:**
1. Click any category button
2. Only passwords in that category will show
3. Click "All" to see everything again

### Adding a New Password

#### Method 1: Manual Entry

1. Click the **"+ Add Password"** button
2. Fill in the form:
   - **Website** - Enter the website URL or name
   - **Username** - Your username or email
   - **Password** - Your password
   - **Category** - Select a category
   - **Notes** - Optional additional information
3. Click **"Save"**

#### Method 2: Browser Extension

The extension can automatically save passwords when you log into websites (see Extension Guide).

### Editing a Password

1. Find the password card
2. Click the **"Edit"** button (pencil icon)
3. Update any fields
4. Click **"Save Changes"**

### Deleting a Password

1. Find the password card
2. Click the **"Delete"** button (trash icon)
3. Confirm deletion in the popup
4. The password is permanently removed

**Warning:** Deletion cannot be undone!

### Marking Favorites

1. Find the password card
2. Click the **star icon** in the top-right corner
3. The star turns gold, indicating it's a favorite
4. Favorites appear at the top when sorted

### Viewing Password Details

1. Click on any password card
2. A modal opens showing all details
3. Click the **"eye icon"** to reveal the password
4. Click **"Copy"** to copy password to clipboard

---

## Browser Extension Guide

The browser extension makes it easy to use your passwords on any website.

### Installing the Extension

#### Chrome

1. Download the extension files
2. Open Chrome and go to `chrome://extensions`
3. Enable **"Developer mode"** (top-right toggle)
4. Click **"Load unpacked"**
5. Select the `browser-extension` folder
6. The BioVault icon appears in your toolbar

#### Firefox

1. Open Firefox and go to `about:debugging`
2. Click **"This Firefox"**
3. Click **"Load Temporary Add-on"**
4. Select the `manifest.json` file
5. The extension is now loaded

### Logging In

1. Click the BioVault icon in your toolbar
2. Enter your email and master password
3. Click **"Login"**
4. The popup shows your recent passwords

### Auto-Filling Passwords

#### Automatic Detection

1. Visit any website with a login form
2. The extension detects the form automatically
3. A **"Login with BioVault"** button appears
4. Click it to see your saved credentials

#### Using the Popup

1. Click the BioVault icon
2. Search or browse your passwords
3. Click on any password
4. The extension fills the form automatically

### Saving New Passwords

#### Automatic Save Prompt

1. Visit a login page
2. Enter your credentials
3. Submit the form
4. The extension shows a **"Save Password?"** popup
5. Click **"Save"** to add it to your vault

#### Manual Save

1. Click the BioVault icon
2. Click **"Add Password"**
3. Fill in the details
4. Click **"Save"**

### Extension Popup Features

The popup includes:
- **Search bar** - Find passwords quickly
- **Recent passwords** - Your most-used credentials
- **Quick actions** - Add, settings, logout
- **Password list** - Scrollable list of all passwords

### Extension Settings

1. Click the BioVault icon
2. Click the **gear icon** (settings)
3. Available settings:
   - Auto-fill preferences
   - Keyboard shortcuts
   - Security options
   - API server URL

---

## Mobile App Guide

The mobile app enables biometric authentication and on-the-go access.

### Installing the App

#### Using Expo Go (Development)

1. Install **Expo Go** from App Store or Google Play
2. Open Expo Go
3. Scan the QR code provided
4. The app opens automatically

#### Production Install (Coming Soon)

- Download from App Store (iOS)
- Download from Google Play (Android)

### First Time Setup

1. Open the app
2. You'll see the pairing screen
3. Follow the pairing instructions (see Device Pairing section)

### Home Screen

After pairing, the home screen shows:
- **Paired devices** list
- **Recent activity**
- **Settings button**
- **Logout option**

### Approving Authentication Requests

When someone tries to log in with biometric auth:

1. You receive a **push notification**
2. Open the app
3. Review the request details:
   - Website requesting access
   - Username
   - Time of request
4. Verify with your fingerprint or Face ID
5. Choose:
   - **Approve** - Allow the login
   - **Deny** - Block the login

### Managing Paired Devices

1. Go to **Settings**
2. Select **"Paired Devices"**
3. View all connected devices
4. Tap any device to:
   - View details
   - Rename device
   - Unpair device

### App Settings

Available settings:
- **Biometric Settings** - Configure fingerprint/Face ID
- **Notifications** - Manage push notifications
- **Security** - PIN code, auto-lock
- **Account** - Email, logout
- **About** - Version info, help

---

## Managing Your Passwords

### Password Organization

#### Using Categories

Organize passwords by category:

1. When adding/editing a password
2. Select a category from the dropdown
3. Choose from preset categories or create new ones

**Recommended Organization:**
- 💼 **Work** - Business accounts, work email, corporate tools
- 🎮 **Social** - Social media, forums, community sites
- 🛒 **Shopping** - E-commerce, retail websites
- 🏦 **Banking** - Financial institutions, payment services
- 📧 **Email** - Email accounts
- 🎵 **Entertainment** - Streaming services, gaming platforms

#### Using Notes

Add context to your passwords:
- Recovery email addresses
- Security questions and answers
- Account numbers
- Special instructions

### Password Best Practices

#### Creating Strong Passwords

Use the built-in password generator:
1. Click "Generate" when adding a password
2. Customize:
   - Length (12-32 characters)
   - Include uppercase
   - Include numbers
   - Include symbols
3. Copy the generated password

#### Password Health

Regularly review your passwords:
- ❌ Weak passwords (less than 8 characters)
- ❌ Reused passwords
- ❌ Old passwords (not changed in 6+ months)
- ✅ Strong, unique passwords

### Importing Passwords

#### From Another Password Manager

1. Export passwords from your current manager as CSV
2. In BioVault, go to **Settings** → **Import**
3. Select the CSV file
4. Map the columns (website, username, password)
5. Click **"Import"**

#### From Browser

1. Export passwords from Chrome/Firefox
2. Follow the import steps above

### Exporting Passwords

To backup or transfer your passwords:

1. Go to **Settings** → **Export**
2. Verify your master password
3. Choose export format:
   - Encrypted JSON (recommended)
   - CSV (plain text, less secure)
4. Save the file securely

**Warning:** Exported files contain your passwords. Keep them secure!

---

## Device Pairing

Device pairing connects your mobile app to your account for biometric authentication.

### Why Pair Devices?

- ✅ Use biometric auth (fingerprint/Face ID)
- ✅ Approve logins from anywhere
- ✅ Enhanced security with two-factor authentication
- ✅ Convenient, no need to type passwords

### Pairing Your Mobile Device

#### Step 1: Start Pairing (Web Dashboard)

1. Log into the web dashboard
2. Click your profile icon
3. Select **"Pair Mobile Device"**
4. A QR code appears

#### Step 2: Scan QR Code (Mobile App)

1. Open the BioVault mobile app
2. Tap **"Pair New Device"**
3. Grant camera permission
4. Point camera at the QR code
5. The app scans automatically

#### Step 3: Verify Biometric

1. The app prompts for biometric auth
2. Use your fingerprint or Face ID
3. Wait for confirmation

#### Step 4: Complete Pairing

1. Both devices show success message
2. The mobile device appears in your device list
3. You can now use biometric auth

### Manual Pairing (No QR Code)

If you can't scan the QR code:

1. Note the pairing code (6 characters)
2. In the mobile app, select **"Enter Code Manually"**
3. Type the pairing code
4. Continue with biometric verification

### Managing Paired Devices

#### View Paired Devices

1. Web dashboard → Profile → **"Devices"**
2. See all paired devices with:
   - Device name
   - Device type (mobile, extension)
   - Last used date
   - Pairing date

#### Rename Device

1. Find the device in the list
2. Click **"Rename"**
3. Enter a new name
4. Click **"Save"**

#### Unpair Device

1. Find the device
2. Click **"Unpair"**
3. Confirm removal
4. The device can no longer approve logins

**When to unpair:**
- Lost or stolen device
- Selling/giving away device
- Device no longer in use

---

## Biometric Authentication

Use your fingerprint or Face ID to log into websites quickly and securely.

### How It Works

1. **Browser Extension** detects a login form
2. You click **"Login with BioVault"**
3. Request sent to your **mobile device**
4. You **approve with biometric** (fingerprint/Face ID)
5. **Credentials auto-filled** in browser

### Using Biometric Auth

#### On a Website

1. Visit a website with saved credentials
2. Click **"Login with BioVault"** button
3. Check your mobile device
4. Approve the request with biometric
5. The form fills automatically

#### With Browser Extension

1. Click the BioVault icon
2. Select a password
3. Click **"Use Biometric"**
4. Approve on mobile device
5. Password fills in the form

### Biometric Settings

#### Enable Biometric Auth

1. Mobile app → **Settings**
2. **"Biometric Authentication"**
3. Enable the toggle
4. Register your fingerprint/Face ID

#### Set Up PIN Fallback

If biometric fails:

1. Mobile app → **Settings** → **"PIN Code"**
2. Create a 4-6 digit PIN
3. Use this PIN when biometric is unavailable

### Security Features

- **Timeout** - Requests expire after 2 minutes
- **Local Processing** - Biometric data never leaves your device
- **Approval Required** - Each request must be explicitly approved
- **Device Verification** - Only paired devices can approve

### Troubleshooting Biometric Auth

**Not receiving requests?**
- Check internet connection
- Ensure mobile app is open
- Verify device is paired
- Check notification permissions

**Biometric not working?**
- Re-register fingerprint/Face ID
- Use PIN fallback
- Restart the mobile app

---

## Security Best Practices

### Master Password Security

Your master password is critical. Never:
- ❌ Share it with anyone
- ❌ Write it down insecurely
- ❌ Use it on other websites
- ❌ Save it in your browser

Do:
- ✅ Make it strong and unique
- ✅ Remember it securely
- ✅ Change it periodically
- ✅ Use a memorable passphrase

### Account Security

#### Two-Factor Authentication

Always pair a mobile device for 2FA:
- Requires physical access to your phone
- Biometric verification required
- Protection against unauthorized access

#### Device Management

Regularly review paired devices:
- Remove old or unused devices
- Unpair lost or stolen devices
- Give devices descriptive names

#### Session Management

- Log out when using shared computers
- Don't save master password in browser
- Clear browser cache on public computers

### Password Security

#### Use Unique Passwords

Never reuse passwords across sites:
- Each site gets a unique password
- Use the password generator
- Regularly check for reused passwords

#### Update Old Passwords

Change passwords periodically:
- After security breaches
- Every 6-12 months
- Immediately if compromised

#### Password Strength

Strong passwords have:
- ✅ 12+ characters
- ✅ Mix of upper/lowercase
- ✅ Numbers and symbols
- ✅ No dictionary words
- ✅ No personal information

### Data Security

#### Secure Your Devices

- Use device encryption
- Enable screen lock
- Keep software updated
- Use antivirus software

#### Network Security

- Use secure Wi-Fi networks
- Avoid public Wi-Fi for sensitive actions
- Use VPN when needed
- Enable firewall

#### Backup Your Data

Regularly backup your vault:
- Export encrypted backup
- Store backup securely
- Test restore process
- Keep multiple backups

---

## Troubleshooting

### Common Issues

#### Can't Log In

**Forgot Master Password?**
- Unfortunately, we cannot recover your master password
- This is by design for security
- You'll need to create a new account

**Invalid Credentials Error?**
- Double-check email spelling
- Ensure caps lock is off
- Try resetting password (if recovery is set up)

#### Passwords Not Syncing

1. Check internet connection
2. Log out and log back in
3. Refresh the browser
4. Check WebSocket connection in console

#### Extension Not Working

1. Reload the extension:
   - `chrome://extensions`
   - Click reload button
2. Check extension permissions
3. Clear browser cache
4. Reinstall extension

#### Mobile App Issues

**Can't Pair Device:**
- Check internet connection
- Ensure QR code is visible
- Try manual code entry
- Log out and try again

**Biometric Not Working:**
- Check biometric permissions
- Re-register fingerprint/Face ID
- Use PIN fallback
- Update the app

### Getting Help

If problems persist:

1. **Check Documentation**
   - Review this user guide
   - Check the troubleshooting guide
   - Read the FAQ

2. **Search Issues**
   - GitHub Issues page
   - Community forums
   - Known issues list

3. **Contact Support**
   - Open a support ticket
   - Email support team
   - Community chat

---

## FAQ

### General Questions

**Q: Is BioVault free?**
A: Yes, BioVault is open-source and free to use.

**Q: How secure is BioVault?**
A: Very secure. We use industry-standard encryption, zero-knowledge architecture, and biometric authentication.

**Q: Can I use BioVault offline?**
A: Partial. Viewing saved passwords works offline, but syncing requires internet.

**Q: How many passwords can I store?**
A: Unlimited! There's no limit on password storage.

**Q: Does BioVault work on mobile browsers?**
A: The mobile app is primarily for biometric auth. Mobile browser support is coming soon.

### Account Questions

**Q: Can I change my master password?**
A: Yes, in Settings → Security → Change Master Password.

**Q: What happens if I forget my master password?**
A: Unfortunately, it cannot be recovered. This is by design for security. You'll need to create a new account.

**Q: Can I have multiple accounts?**
A: Yes, but you'll need different email addresses for each account.

**Q: How do I delete my account?**
A: Settings → Account → Delete Account. This is permanent and cannot be undone.

### Device Questions

**Q: How many devices can I pair?**
A: Unlimited devices can be paired to your account.

**Q: What happens if I lose my phone?**
A: Unpair the device immediately from the web dashboard to prevent unauthorized access.

**Q: Can I use multiple mobile devices?**
A: Yes, pair as many devices as needed for biometric auth.

### Security Questions

**Q: Where are my passwords stored?**
A: On the BioVault server, encrypted with your master password.

**Q: Can BioVault see my passwords?**
A: No, we use zero-knowledge encryption. Passwords are encrypted on your device before being sent to the server.

**Q: Is biometric data stored on the server?**
A: No, biometric data never leaves your device. It's processed locally on your mobile device.

**Q: What if the server is hacked?**
A: Your passwords are encrypted with your master password. Without it, the data is useless to hackers.

### Technical Questions

**Q: Which browsers are supported?**
A: Chrome, Firefox, Edge, and other Chromium-based browsers.

**Q: Which mobile platforms are supported?**
A: iOS and Android via React Native.

**Q: Can I self-host BioVault?**
A: Yes! BioVault is open-source and can be self-hosted.

**Q: Is there an API?**
A: Yes, see the API Reference documentation.

---

## Tips & Tricks

### Productivity Tips

1. **Use Keyboard Shortcuts**
   - `Ctrl/Cmd + K` - Quick search
   - `Ctrl/Cmd + N` - New password
   - `Esc` - Close modals

2. **Organize with Categories**
   - Create custom categories
   - Use color coding
   - Filter by multiple categories

3. **Use Favorites**
   - Star frequently used passwords
   - They appear at the top
   - Quick access to important accounts

4. **Master the Search**
   - Search by website, username, or notes
   - Use partial matches
   - Combine with category filters

### Security Tips

1. **Enable Biometric Auth**
   - Faster and more secure
   - No need to type passwords
   - Two-factor authentication

2. **Regular Password Audits**
   - Check for weak passwords monthly
   - Update old passwords
   - Remove unused accounts

3. **Use Strong Categories**
   - Separate work and personal
   - Different categories for different risk levels
   - Easier to manage security

4. **Keep Software Updated**
   - Update browser extension
   - Update mobile app
   - Update web dashboard

---

## Next Steps

Now that you know how to use BioVault:

1. ✅ Add your first passwords
2. ✅ Install the browser extension
3. ✅ Pair your mobile device
4. ✅ Try biometric authentication
5. ✅ Explore advanced features

### Additional Resources

- [Developer Guide](DEVELOPER_GUIDE.md) - For developers
- [API Reference](API_REFERENCE.md) - API documentation
- [Security Documentation](SECURITY.md) - Security details
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common issues

---

## Feedback

We'd love to hear from you!

- **Report bugs** - Open a GitHub issue
- **Suggest features** - Submit a feature request
- **Contribute** - See Contributing Guide
- **Share feedback** - Contact the team

---

**Thank you for using BioVault!** 🔒✨

Stay secure and password-free with biometric authentication.

---

**Last Updated:** November 2024  
**Version:** 1.0.0
