# BioVault Extension Icons

The browser extension requires 3 icon files. You have two options:

## Option 1: Quick Fix - Use Icon Generator (Recommended)

I've created an HTML icon generator for you. Open the file in your browser:

**File**: `icon-generator.html` (in the browser-extension folder)

1. Open `browser-extension/icon-generator.html` in Chrome/Firefox
2. Click the buttons to download all 3 icons
3. Icons will be saved to your Downloads folder
4. Move them to this `icons/` folder

## Option 2: Download Free Icons

Download PNG icons from any of these sources:

### Free Icon Sources:
- **Flaticon**: https://www.flaticon.com/ (search "lock" or "security")
- **Icons8**: https://icons8.com/ (search "password")
- **Iconfinder**: https://www.iconfinder.com/ (search "vault")

### Required Sizes:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Option 3: Use Placeholder Text Icons (Temporary)

If you just want to test quickly, you can temporarily modify the manifest to not require icons:

1. Open `manifest.json`
2. Comment out or remove the `icons` section
3. The extension will load but show a default icon

---

## What These Icons Are For

- **icon16.png**: Shows in the browser toolbar (small)
- **icon48.png**: Shows in extension management page
- **icon128.png**: Shows in Chrome Web Store and installation

---

## Recommended Design

For BioVault, use:
- **Theme**: Purple/Blue gradient (matches the app theme #667eea to #764ba2)
- **Symbol**: Lock, shield, or vault icon
- **Style**: Modern, minimal, professional
