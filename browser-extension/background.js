// BioVault Background Service Worker
const API_BASE_URL = 'http://192.168.2.244:3001';

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveCredentials') {
    handleSaveCredentials(request.data, sendResponse);
    return true;
  } else if (request.action === 'getCredentials') {
    handleGetCredentials(request.domain, sendResponse);
    return true;
  } else if (request.action === 'login') {
    handleLogin(request.data, sendResponse);
    return true;
  } else if (request.action === 'logout') {
    handleLogout(sendResponse);
    return true;
  } else if (request.action === 'getAllPasswords') {
    handleGetAllPasswords(sendResponse);
    return true;
  } else if (request.action === 'checkAuth') {
    handleCheckAuth(sendResponse);
    return true;
  } else if (request.action === 'deletePassword') {
    handleDeletePassword(request.id, sendResponse);
    return true;
  } else if (request.action === 'requestBiometricAuth') {
    handleBiometricAuth(request.domain, sendResponse);
    return true;
  } else if (request.action === 'setUserEmail') {
    handleSetUserEmail(request.email, sendResponse);
    return true;
  } else if (request.action === 'requestAuth') {
    handleAuthRequest(request.domain, sendResponse);
    return true;
  } else if (request.action === 'pollAuthStatus') {
    handlePollAuthStatus(request.requestId, sendResponse);
    return true;
  }
});

// Handle saving credentials to backend
async function handleSaveCredentials(data, sendResponse) {
  try {
    console.log('[BioVault] Saving credentials:', {
      website: data.website || data.domain,
      username: data.username,
      domain: data.domain
    });

    const token = await getAuthToken();
    if (!token) {
      console.error('[BioVault] No auth token for saving');
      sendResponse({ success: false, error: 'Not authenticated' });
      return;
    }

    const payload = {
      website: data.website || data.domain,
      username: data.username,
      password: data.password
    };

    console.log('[BioVault] Sending to backend:', payload);

    const response = await fetch(`${API_BASE_URL}/api/passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    console.log('[BioVault] Save response status:', response.status);

    const result = await response.json();
    console.log('[BioVault] Save response:', result);

    if (response.ok) {
      console.log('[BioVault] Credentials saved successfully');
      sendResponse({ success: true, data: result });
    } else {
      console.error('[BioVault] Failed to save:', result.error);
      sendResponse({ success: false, error: result.error || 'Failed to save credentials' });
    }
  } catch (error) {
    console.error('[BioVault] Error saving credentials:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle retrieving credentials for a domain
async function handleGetCredentials(domain, sendResponse) {
  try {
    console.log('[BioVault] Getting credentials for domain:', domain);

    const token = await getAuthToken();
    if (!token) {
      console.error('[BioVault] No auth token found');
      sendResponse({ success: false, error: 'Not authenticated' });
      return;
    }

    console.log('[BioVault] Auth token found, fetching from backend...');

    // Always fetch from backend (source of truth)
    const response = await fetch(`${API_BASE_URL}/api/passwords`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('[BioVault] Backend response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      const allPasswords = data.passwords || [];

      console.log('[BioVault] Total passwords from backend:', allPasswords.length);
      console.log('[BioVault] All passwords:', JSON.stringify(allPasswords, null, 2));

      // Filter passwords by domain (client-side filtering)
      // Match if website/url field contains the domain
      const matchingPasswords = allPasswords.filter(pwd => {
        // Check both 'website' and 'url' fields (dashboard uses 'url')
        const websiteUrl = pwd.website || pwd.url;

        if (!websiteUrl) {
          console.log('[BioVault] Skipping password with no website/url field:', pwd);
          return false;
        }

        // Normalize both strings for comparison
        const normalizedWebsite = websiteUrl.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
        const normalizedDomain = domain.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');

        console.log('[BioVault] Comparing:', {
          websiteUrl,
          normalizedWebsite,
          normalizedDomain,
          matches: normalizedWebsite.includes(normalizedDomain) || normalizedDomain.includes(normalizedWebsite)
        });

        // Check if website contains the domain or vice versa
        return normalizedWebsite.includes(normalizedDomain) || normalizedDomain.includes(normalizedWebsite);
      });

      console.log(`[BioVault] Found ${matchingPasswords.length} matching credentials for domain: ${domain}`);
      sendResponse({ success: true, credentials: matchingPasswords });
    } else {
      const errorData = await response.text();
      console.error('[BioVault] Failed to retrieve credentials:', response.status, errorData);
      sendResponse({ success: false, error: 'Failed to retrieve credentials' });
    }
  } catch (error) {
    console.error('[BioVault] Error getting credentials:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle user login
async function handleLogin(credentials, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store auth token and user email
      await chrome.storage.local.set({
        authToken: data.token,
        user: data.user,
        userEmail: credentials.email, // Store email for authentication requests
        loginTime: Date.now()
      });
      sendResponse({ success: true, user: data.user });
    } else {
      sendResponse({ success: false, error: data.error || 'Login failed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle user logout
async function handleLogout(sendResponse) {
  try {
    await chrome.storage.local.clear();
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle getting all passwords
async function handleGetAllPasswords(sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated' });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/passwords`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      sendResponse({ success: true, passwords: data.passwords || [] });
    } else {
      sendResponse({ success: false, error: 'Failed to retrieve passwords' });
    }
  } catch (error) {
    console.error('Error getting all passwords:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle checking authentication status
async function handleCheckAuth(sendResponse) {
  try {
    const result = await chrome.storage.local.get(['authToken', 'user', 'loginTime']);

    if (result.authToken && result.user) {
      // Check if token is still valid (24 hours)
      const isExpired = result.loginTime && (Date.now() - result.loginTime > 24 * 60 * 60 * 1000);

      if (isExpired) {
        await chrome.storage.local.clear();
        sendResponse({ authenticated: false });
      } else {
        sendResponse({ authenticated: true, user: result.user });
      }
    } else {
      sendResponse({ authenticated: false });
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    sendResponse({ authenticated: false, error: error.message });
  }
}

// Handle deleting a password
async function handleDeletePassword(id, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated' });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/passwords/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      sendResponse({ success: true });
    } else {
      const data = await response.json();
      sendResponse({ success: false, error: data.error || 'Failed to delete password' });
    }
  } catch (error) {
    console.error('Error deleting password:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle biometric authentication request
async function handleBiometricAuth(domain, sendResponse) {
  try {
    const token = await getAuthToken();
    if (!token) {
      sendResponse({ success: false, error: 'Not authenticated' });
      return;
    }

    // Request biometric authentication from backend
    const response = await fetch(`${API_BASE_URL}/api/auth/biometric/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ domain })
    });

    const data = await response.json();

    if (response.ok) {
      sendResponse({ success: true, data: data });
    } else {
      sendResponse({ success: false, error: data.error || 'Biometric auth failed' });
    }
  } catch (error) {
    console.error('Error during biometric auth:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Helper function to get auth token
async function getAuthToken() {
  const result = await chrome.storage.local.get(['authToken']);
  return result.authToken || null;
}

// Helper function to save to local storage
async function saveToLocalStorage(data) {
  try {
    const key = `credentials_${data.domain}`;
    const existing = await chrome.storage.local.get([key]);
    let credentials = existing[key] || [];

    // Add new credential if it doesn't exist
    const exists = credentials.some(c => c.username === data.username);
    if (!exists) {
      credentials.push({
        username: data.username,
        password: data.password,
        website: data.website
      });
      await chrome.storage.local.set({ [key]: credentials });
    }
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

// Helper function to get from local storage
async function getFromLocalStorage(domain) {
  try {
    const key = `credentials_${domain}`;
    const result = await chrome.storage.local.get([key]);
    return result[key] || [];
  } catch (error) {
    console.error('Error getting from local storage:', error);
    return [];
  }
}

// Handle setting user email (called from web dashboard)
async function handleSetUserEmail(email, sendResponse) {
  try {
    await chrome.storage.local.set({ userEmail: email });
    console.log('User email stored:', email);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error setting user email:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle authentication request (called from content script)
async function handleAuthRequest(domain, sendResponse) {
  try {
    const result = await chrome.storage.local.get(['userEmail']);
    const userEmail = result.userEmail;

    if (!userEmail) {
      sendResponse({ success: false, error: 'No user email found' });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth-request/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userEmail,
        context: `Browser Extension - ${domain}`
      })
    });

    const data = await response.json();
    sendResponse({ success: response.ok, data: data });
  } catch (error) {
    console.error('Error requesting authentication:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle polling authentication status (called from content script)
async function handlePollAuthStatus(requestId, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth-request/status/${requestId}`);
    const data = await response.json();
    sendResponse({ success: response.ok, data: data });
  } catch (error) {
    console.error('Error polling auth status:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Listen for tab updates to inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.tabs.sendMessage(tabId, { action: 'scanForForms' }).catch(() => {
      // Content script might not be loaded yet, ignore error
    });
  }
});

console.log('BioVault background service worker initialized');
