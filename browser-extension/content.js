// BioVault Content Script
// Detects login forms and injects BioVault key icon

(function() {
  'use strict';

  let formObserver = null;
  let injectedIcons = new Set();

  // Initialize content script
  function init() {
    console.log('BioVault content script initialized');

    // Check for pending save credentials from form submission
    chrome.storage.local.get(['pendingSaveCredentials'], (result) => {
      if (result.pendingSaveCredentials) {
        const pending = result.pendingSaveCredentials;
        const currentDomain = extractDomain(window.location.hostname);

        console.log('[BioVault] Found pending credentials:', {
          pendingDomain: pending.domain,
          currentDomain: currentDomain,
          timestamp: pending.timestamp,
          age: Date.now() - pending.timestamp
        });

        // Only show if same domain and recent (within 10 seconds to account for slow redirects)
        if (pending.domain === currentDomain && (Date.now() - pending.timestamp) < 10000) {
          console.log('[BioVault] Showing save prompt for pending credentials');

          // Wait a bit for page to fully load before showing prompt
          setTimeout(() => {
            showSaveCredentialsPrompt(pending.username, pending.password, pending.domain);
            // Clear the pending credentials after showing
            chrome.storage.local.remove(['pendingSaveCredentials']);
          }, 1000);
        } else {
          console.log('[BioVault] Pending credentials expired or domain mismatch, clearing');
          chrome.storage.local.remove(['pendingSaveCredentials']);
        }
      }
    });

    scanForLoginForms();
    observeFormChanges();
    setupMessageListener();
  }

  // Scan page for login forms
  function scanForLoginForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const passwordField = form.querySelector('input[type="password"]');
      const usernameField = findUsernameField(form);

      if (passwordField && usernameField && !isFormInjected(form)) {
        injectBioVaultIcon(usernameField, passwordField);
        setupFormSubmitListener(form, usernameField, passwordField);
      }
    });
  }

  // Find username field in form
  function findUsernameField(form) {
    // Look for common username field patterns
    const selectors = [
      'input[type="email"]',
      'input[type="text"][name*="email" i]',
      'input[type="text"][name*="username" i]',
      'input[type="text"][name*="user" i]',
      'input[type="text"][id*="email" i]',
      'input[type="text"][id*="username" i]',
      'input[type="text"][id*="user" i]',
      'input[autocomplete="username"]',
      'input[autocomplete="email"]'
    ];

    for (const selector of selectors) {
      const field = form.querySelector(selector);
      if (field) return field;
    }

    // Fallback: find first text input before password field
    const textInputs = form.querySelectorAll('input[type="text"]');
    return textInputs.length > 0 ? textInputs[0] : null;
  }

  // Check if form already has BioVault icon
  function isFormInjected(form) {
    return injectedIcons.has(form) || form.querySelector('.biovault-icon-wrapper');
  }

  // Inject BioVault key icon next to input fields
  function injectBioVaultIcon(usernameField, passwordField) {
    // Add icon to username field
    addIconToField(usernameField, passwordField, 'username');
    // Add icon to password field
    addIconToField(passwordField, usernameField, 'password');
  }

  // Add icon to a specific input field
  function addIconToField(targetField, otherField, fieldType) {
    if (!targetField) return;

    // Check if icon already exists for this field
    const existingIcon = targetField.parentElement?.querySelector('.biovault-icon-wrapper');
    if (existingIcon) return;

    // Get or create wrapper for the field
    let wrapper = targetField.parentElement;
    const isWrapped = wrapper && wrapper.classList.contains('biovault-field-wrapper');

    if (!isWrapped) {
      wrapper = document.createElement('div');
      wrapper.className = 'biovault-field-wrapper';
      wrapper.style.cssText = `
        position: relative;
        display: block;
      `;

      targetField.parentNode.insertBefore(wrapper, targetField);
      wrapper.appendChild(targetField);
    }

    // Preserve original input width and ensure it stays full width
    const computedStyle = window.getComputedStyle(targetField);
    if (!targetField.style.width) {
      targetField.style.width = '100%';
    }
    targetField.style.boxSizing = 'border-box';

    // Ensure input has proper padding for the icon
    const currentPaddingRight = parseInt(computedStyle.paddingRight) || 10;
    targetField.style.paddingRight = Math.max(currentPaddingRight, 40) + 'px';

    // Create icon container
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'biovault-icon-wrapper';
    iconWrapper.style.cssText = `
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      cursor: pointer;
      z-index: 999999;
      border-radius: 4px;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      background: transparent;
    `;

    // Create key icon (SVG)
    iconWrapper.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#667eea"/>
      </svg>
    `;

    iconWrapper.title = 'Login with BioVault';

    // Hover effects
    iconWrapper.addEventListener('mouseenter', () => {
      iconWrapper.style.background = 'rgba(102, 126, 234, 0.1)';
    });

    iconWrapper.addEventListener('mouseleave', () => {
      iconWrapper.style.background = 'transparent';
    });

    // Click handler
    iconWrapper.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleBioVaultLogin(fieldType === 'username' ? targetField : otherField,
                          fieldType === 'password' ? targetField : otherField);
    });

    wrapper.appendChild(iconWrapper);
    injectedIcons.add(targetField.closest('form'));
  }

  // Handle BioVault login button click
  async function handleBioVaultLogin(usernameField, passwordField) {
    try {
      const domain = extractDomain(window.location.hostname);

      // Show loading notification
      showNotification('Loading credentials...', 'info');

      // Request credentials from background script
      chrome.runtime.sendMessage(
        { action: 'getCredentials', domain: domain },
        async (response) => {
          if (response && response.success && response.credentials.length > 0) {
            // First request biometric authentication
            await requestBiometricAuthBeforeFill(response.credentials, usernameField, passwordField, domain);
          } else {
            showNotification('No saved credentials found for this site', 'info');
          }
        }
      );
    } catch (error) {
      console.error('Error during BioVault login:', error);
      showNotification('Failed to retrieve credentials', 'error');
    }
  }

  // Request biometric auth before filling credentials
  async function requestBiometricAuthBeforeFill(credentials, usernameField, passwordField, domain) {
    // Show authentication dialog
    const overlay = showAuthDialog();

    // Request biometric authentication via background script
    chrome.runtime.sendMessage(
      { action: 'requestAuth', domain: domain },
      (response) => {
        if (!response || !response.success) {
          document.body.removeChild(overlay);
          showNotification(response?.error || 'Failed to request authentication', 'error');
          return;
        }

        const requestId = response.data.requestId;

        // Update dialog
        updateAuthDialog(overlay, 'Waiting for approval on your mobile device...', 'pending');

        // Poll for authentication status
        pollAuthStatus(requestId, (status) => {
          if (status === 'approved') {
            document.body.removeChild(overlay);
            showNotification('Authentication approved!', 'success');

            // Now show credential selection or auto-fill
            if (credentials.length > 1) {
              showCredentialSelection(credentials, usernameField, passwordField);
            } else {
              fillCredentials(credentials[0], usernameField, passwordField);
            }
          } else if (status === 'denied') {
            updateAuthDialog(overlay, 'Authentication denied', 'error');
            setTimeout(() => document.body.removeChild(overlay), 2000);
          } else if (status === 'expired') {
            updateAuthDialog(overlay, 'Authentication request expired', 'error');
            setTimeout(() => document.body.removeChild(overlay), 2000);
          }
        });
      }
    );
  }

  // Show authentication dialog
  function showAuthDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'biovault-auth-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    `;

    const dialog = document.createElement('div');
    dialog.className = 'biovault-auth-dialog';
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
    `;

    dialog.innerHTML = `
      <div class="auth-icon" style="font-size: 48px; margin-bottom: 16px;">🔐</div>
      <h3 class="auth-title" style="margin: 0 0 8px 0; color: #333; font-size: 20px;">Requesting Authentication</h3>
      <p class="auth-message" style="margin: 0; color: #666; font-size: 14px;">Please approve on your mobile device</p>
      <div class="auth-spinner" style="margin-top: 24px;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    return overlay;
  }

  // Update authentication dialog
  function updateAuthDialog(overlay, message, status) {
    const dialog = overlay.querySelector('.biovault-auth-dialog');
    const icon = dialog.querySelector('.auth-icon');
    const messageEl = dialog.querySelector('.auth-message');
    const spinner = dialog.querySelector('.auth-spinner');

    messageEl.textContent = message;

    if (status === 'approved') {
      icon.textContent = '✅';
      spinner.style.display = 'none';
    } else if (status === 'denied' || status === 'error') {
      icon.textContent = '❌';
      spinner.style.display = 'none';
    }
  }

  // Poll authentication status
  function pollAuthStatus(requestId, callback) {
    const pollInterval = setInterval(() => {
      chrome.runtime.sendMessage(
        { action: 'pollAuthStatus', requestId: requestId },
        (response) => {
          if (response && response.success && response.data.success) {
            if (response.data.status !== 'pending') {
              clearInterval(pollInterval);
              callback(response.data.status);
            }
          }
        }
      );
    }, 1000);

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      callback('expired');
    }, 120000);
  }

  // Show credential selection dialog
  function showCredentialSelection(credentials, usernameField, passwordField) {
    const overlay = document.createElement('div');
    overlay.className = 'biovault-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    `;

    const title = document.createElement('h3');
    title.textContent = 'Select Account';
    title.style.cssText = `
      margin: 0 0 16px 0;
      color: #333;
      font-size: 18px;
    `;

    dialog.appendChild(title);

    credentials.forEach(cred => {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 12px;
        margin: 8px 0;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      `;

      item.innerHTML = `
        <div style="font-weight: 600; color: #333;">${cred.username}</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">${cred.website || window.location.hostname}</div>
      `;

      item.onmouseover = () => {
        item.style.background = '#f5f5f5';
        item.style.borderColor = '#667eea';
      };

      item.onmouseout = () => {
        item.style.background = 'white';
        item.style.borderColor = '#e0e0e0';
      };

      item.onclick = () => {
        fillCredentials(cred, usernameField, passwordField);
        document.body.removeChild(overlay);
      };

      dialog.appendChild(item);
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      width: 100%;
      padding: 10px;
      margin-top: 16px;
      background: #f5f5f5;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;
    cancelButton.onclick = () => document.body.removeChild(overlay);

    dialog.appendChild(cancelButton);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  }

  // Fill credentials into form fields
  function fillCredentials(credential, usernameField, passwordField) {
    if (usernameField) {
      usernameField.value = credential.username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      usernameField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (passwordField) {
      passwordField.value = credential.password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    showNotification('Credentials filled successfully!', 'success');
  }

  // Setup form submit listener to save credentials
  function setupFormSubmitListener(form, usernameField, passwordField) {
    console.log('[BioVault] Setting up form submit listener');

    form.addEventListener('submit', async (e) => {
      console.log('[BioVault] Form submitted');

      const username = usernameField?.value;
      const password = passwordField?.value;

      console.log('[BioVault] Captured credentials:', { username: username ? 'present' : 'missing', password: password ? 'present' : 'missing' });

      if (username && password) {
        const domain = extractDomain(window.location.hostname);
        console.log('[BioVault] Checking for existing credentials for domain:', domain);

        // Check if these credentials already exist
        chrome.runtime.sendMessage({
          action: 'getCredentials',
          domain: domain
        }, (response) => {
          console.log('[BioVault] Got credentials response:', response);

          if (response && response.success) {
            const existingCreds = response.credentials || [];
            const credExists = existingCreds.some(cred => cred.username === username);

            console.log('[BioVault] Credential exists?', credExists, 'Total creds:', existingCreds.length);

            if (!credExists) {
              // Store credentials temporarily to show prompt after page navigation
              console.log('[BioVault] Saving pending credentials to storage');
              chrome.storage.local.set({
                pendingSaveCredentials: {
                  username,
                  password,
                  domain,
                  timestamp: Date.now()
                }
              });
            } else {
              console.log('[BioVault] Credentials already exist, not prompting');
            }
          }
        });
      }
    });
  }

  // Show prompt to save credentials
  function showSaveCredentialsPrompt(username, password, domain) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;

    dialog.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#667eea"/>
        </svg>
        <h2 style="margin: 0 0 0 12px; font-size: 20px; color: #1f2937;">Save Password to BioVault?</h2>
      </div>
      <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">
        Would you like to save these credentials for <strong>${domain}</strong>?
      </p>
      <div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-size: 13px; color: #4b5563; margin-bottom: 4px;">
          <strong>Username:</strong> ${username}
        </div>
        <div style="font-size: 13px; color: #4b5563;">
          <strong>Password:</strong> ${'•'.repeat(password.length)}
        </div>
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="biovault-save-cancel" style="
          padding: 10px 20px;
          border: 1px solid #d1d5db;
          background: white;
          color: #4b5563;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        ">Not Now</button>
        <button id="biovault-save-confirm" style="
          padding: 10px 20px;
          border: none;
          background: #667eea;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        ">Save Password</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Add hover effects
    const confirmBtn = dialog.querySelector('#biovault-save-confirm');
    const cancelBtn = dialog.querySelector('#biovault-save-cancel');

    confirmBtn.addEventListener('mouseover', () => {
      confirmBtn.style.background = '#5a67d8';
    });
    confirmBtn.addEventListener('mouseout', () => {
      confirmBtn.style.background = '#667eea';
    });

    cancelBtn.addEventListener('mouseover', () => {
      cancelBtn.style.background = '#f3f4f6';
    });
    cancelBtn.addEventListener('mouseout', () => {
      cancelBtn.style.background = 'white';
    });

    // Handle cancel
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Handle confirm
    confirmBtn.addEventListener('click', () => {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Saving...';

      chrome.runtime.sendMessage({
        action: 'saveCredentials',
        data: {
          domain: domain,
          username: username,
          password: password,
          website: window.location.hostname
        }
      }, (response) => {
        if (response && response.success) {
          showNotification('Password saved to BioVault!', 'success');
        } else {
          showNotification('Failed to save password. Please try again.', 'error');
        }
        document.body.removeChild(overlay);
      });
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  // Extract domain from hostname
  function extractDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'biovault-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      font-size: 14px;
      animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Observe DOM changes for dynamically added forms
  function observeFormChanges() {
    formObserver = new MutationObserver(() => {
      scanForLoginForms();
    });

    formObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Setup message listener
  function setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'scanForForms') {
        scanForLoginForms();
        sendResponse({ success: true });
      }
    });
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);

  // Listen for messages from the web page (for dashboard communication)
  window.addEventListener('message', (event) => {
    // Only accept messages from same origin
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'BIOVAULT_SET_USER_EMAIL' && event.data.email) {
      // Forward to background script
      chrome.runtime.sendMessage(
        {
          action: 'setUserEmail',
          email: event.data.email
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Extension communication error:', chrome.runtime.lastError);
          } else {
            console.log('User email stored in extension:', event.data.email);
          }
        }
      );
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
