# Clear Extension Cache

The extension was previously caching credentials in local storage. This has been fixed, but you need to clear the old cached data.

## Method 1: Using Browser Console (Recommended)

1. Open the extension popup (click the BioVault icon in your browser toolbar)
2. Right-click on the popup and select "Inspect"
3. In the DevTools console that opens, paste this command:

```javascript
chrome.storage.local.clear(() => {
  console.log('Cache cleared successfully!');
});
```

4. Press Enter
5. Reload the extension (go to chrome://extensions and click the reload button)

## Method 2: Using Extension Background Page

1. Go to `chrome://extensions`
2. Enable "Developer mode" (toggle in top right)
3. Find "BioVault Password Manager" extension
4. Click "background page" or "service worker" link
5. In the console that opens, paste:

```javascript
chrome.storage.local.clear(() => {
  console.log('Cache cleared successfully!');
});
```

6. Press Enter
7. Reload the extension

## Verify Cache is Cleared

After clearing, you can verify with:

```javascript
chrome.storage.local.get(null, (items) => {
  console.log('Stored items:', items);
});
```

You should only see `authToken`, `user`, `userEmail`, and `loginTime` - no `credentials_*` keys.

## What Changed

- Extension now always fetches credentials from the backend database (source of truth)
- No more local caching of credentials
- This ensures the extension always shows the current state of your passwords
