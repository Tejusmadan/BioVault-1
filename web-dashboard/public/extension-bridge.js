// Extension Bridge Script
// This script allows the web dashboard to communicate with the browser extension

// Check if we're running in a browser with chrome extension API
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
  console.log('BioVault Extension Bridge initialized');

  // Listen for messages from the web page
  window.addEventListener('message', (event) => {
    // Only accept messages from same origin
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'BIOVAULT_SET_USER_EMAIL') {
      // Send message to extension background script
      chrome.runtime.sendMessage(
        {
          action: 'setUserEmail',
          email: event.data.email
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Extension communication error:', chrome.runtime.lastError);
          } else {
            console.log('Email sent to extension:', event.data.email);
          }
        }
      );
    }
  });
}
