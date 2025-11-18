// BioVault Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
  setupEventListeners();
});

// Check authentication status
async function checkAuthStatus() {
  chrome.runtime.sendMessage({ action: 'checkAuth' }, (response) => {
    if (response && response.authenticated) {
      showMainScreen(response.user);
      loadPasswords();
    } else {
      showLoginScreen();
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Login form
  document.getElementById('loginButton')?.addEventListener('click', handleLogin);
  document.getElementById('loginEmail')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('loginPassword')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Register link
  document.getElementById('registerLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://192.168.2.244:3000/register' });
  });

  // Main screen actions
  document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
  document.getElementById('pairDeviceButton')?.addEventListener('click', handlePairDevice);
  document.getElementById('openDashboardButton')?.addEventListener('click', handleOpenDashboard);

  // Search functionality
  document.getElementById('searchInput')?.addEventListener('input', handleSearch);
}

// Handle login
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  const button = document.getElementById('loginButton');
  const btnText = button.querySelector('.btn-text');
  const btnLoader = button.querySelector('.btn-loader');

  // Validation
  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }

  // Show loading state
  button.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';
  errorDiv.style.display = 'none';

  // Send login request
  chrome.runtime.sendMessage(
    {
      action: 'login',
      data: { email, password }
    },
    (response) => {
      button.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';

      if (response && response.success) {
        showMainScreen(response.user);
        loadPasswords();
      } else {
        showError(response?.error || 'Login failed. Please check your credentials.');
      }
    }
  );
}

// Handle logout
async function handleLogout() {
  chrome.runtime.sendMessage({ action: 'logout' }, (response) => {
    if (response && response.success) {
      showLoginScreen();
      // Clear password list
      document.getElementById('passwordList').innerHTML = '';
    }
  });
}

// Handle pair device
function handlePairDevice() {
  chrome.tabs.create({ url: 'http://192.168.2.244:3000/pair-device' });
}

// Handle open dashboard
function handleOpenDashboard() {
  chrome.tabs.create({ url: 'http://192.168.2.244:3000/dashboard' });
}

// Load passwords from backend
async function loadPasswords() {
  const spinner = document.getElementById('loadingSpinner');
  const passwordList = document.getElementById('passwordList');

  spinner.style.display = 'flex';
  passwordList.style.display = 'none';

  chrome.runtime.sendMessage({ action: 'getAllPasswords' }, (response) => {
    spinner.style.display = 'none';
    passwordList.style.display = 'block';

    if (response && response.success) {
      displayPasswords(response.passwords);
    } else {
      showEmptyState();
    }
  });
}

// Display passwords in list
function displayPasswords(passwords) {
  const passwordList = document.getElementById('passwordList');
  const passwordCount = document.getElementById('passwordCount');

  if (!passwords || passwords.length === 0) {
    showEmptyState();
    passwordCount.textContent = '0';
    return;
  }

  passwordCount.textContent = passwords.length;

  const html = passwords.map(password => `
    <div class="password-item" data-id="${password.id}" data-domain="${password.domain}" data-username="${password.username}">
      <div class="password-icon">
        <img src="https://www.google.com/s2/favicons?domain=${password.website || password.domain}&sz=32"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect fill=%22%23667eea%22 width=%2232%22 height=%2232%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2216%22>${(password.domain || 'W')[0].toUpperCase()}</text></svg>'"
             alt="${password.domain}">
      </div>
      <div class="password-info">
        <div class="password-domain">${password.website || password.domain}</div>
        <div class="password-username">${password.username}</div>
      </div>
      <div class="password-actions">
        <button class="btn-icon" title="Copy password" data-action="copy" data-password="${encodeURIComponent(password.password)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
          </svg>
        </button>
        <button class="btn-icon" title="Auto-fill" data-action="autofill" data-domain="${password.domain}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
          </svg>
        </button>
        <button class="btn-icon btn-delete" title="Delete" data-action="delete" data-id="${password.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  passwordList.innerHTML = html;

  // Setup action buttons
  setupPasswordActions();
}

// Setup password action buttons
function setupPasswordActions() {
  document.querySelectorAll('.password-actions button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const action = e.currentTarget.dataset.action;

      if (action === 'copy') {
        const password = decodeURIComponent(e.currentTarget.dataset.password);
        await copyToClipboard(password);
        showNotification('Password copied to clipboard!', 'success');
      } else if (action === 'autofill') {
        const domain = e.currentTarget.dataset.domain;
        await autofillPassword(domain);
      } else if (action === 'delete') {
        const id = e.currentTarget.dataset.id;
        await deletePassword(id);
      }
    });
  });
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// Autofill password on current tab
async function autofillPassword(domain) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getCredentials',
        domain: domain
      }, (response) => {
        if (response && response.success) {
          showNotification('Credentials filled on page!', 'success');
          window.close();
        } else {
          showNotification('Failed to fill credentials', 'error');
        }
      });
    }
  });
}

// Delete password
async function deletePassword(id) {
  if (!confirm('Are you sure you want to delete this password?')) {
    return;
  }

  chrome.runtime.sendMessage(
    { action: 'deletePassword', id: id },
    (response) => {
      if (response && response.success) {
        showNotification('Password deleted successfully', 'success');
        loadPasswords();
      } else {
        showNotification('Failed to delete password', 'error');
      }
    }
  );
}

// Handle search
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.password-item');

  items.forEach(item => {
    const domain = item.dataset.domain.toLowerCase();
    const username = item.dataset.username.toLowerCase();

    if (domain.includes(query) || username.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Show login screen
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'block';
  document.getElementById('mainScreen').style.display = 'none';

  // Clear form
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').style.display = 'none';
}

// Show main screen
function showMainScreen(user) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainScreen').style.display = 'block';

  // Update user info
  if (user) {
    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('userEmail').textContent = user.email;
  }
}

// Show empty state
function showEmptyState() {
  const passwordList = document.getElementById('passwordList');
  passwordList.innerHTML = `
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#ddd"/>
      </svg>
      <p>No passwords saved yet</p>
      <small>Visit websites and save your login credentials</small>
    </div>
  `;
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('loginError');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('notification-show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('notification-show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
