/**
 * Configuration file for BioVault Mobile App
 * Centralized configuration management
 */

// Determine if we're in development or production
const __DEV__ = process.env.NODE_ENV !== 'production';

/**
 * API Configuration
 * Update these values based on your environment
 */
const API_CONFIG = {
  // Development configuration (VM backend)
  development: {
    apiUrl: 'http://192.168.2.244:3001',
    wsUrl: 'ws://192.168.2.244:3001',
    timeout: 10000, // 10 seconds
  },

  // Production configuration (VM backend)
  production: {
    apiUrl: 'http://192.168.2.244:3001',
    wsUrl: 'ws://192.168.2.244:3001',
    timeout: 15000, // 15 seconds
  },
};

// Select configuration based on environment
const currentConfig = __DEV__ ? API_CONFIG.development : API_CONFIG.production;

/**
 * App Configuration
 */
export const APP_CONFIG = {
  // App information
  appName: 'BioVault',
  appVersion: '1.0.0',

  // API settings
  apiUrl: currentConfig.apiUrl,
  wsUrl: currentConfig.wsUrl,
  apiTimeout: currentConfig.timeout,

  // Biometric settings
  biometric: {
    promptMessage: 'Authenticate to continue',
    fallbackEnabled: true,
    cancelLabel: 'Cancel',
  },

  // Notification settings
  notifications: {
    channelId: 'auth-requests',
    channelName: 'Authentication Requests',
    importance: 'max',
    sound: true,
    vibrate: true,
  },

  // Security settings
  security: {
    tokenRefreshInterval: 3600000, // 1 hour
    sessionTimeout: 86400000, // 24 hours
    maxLoginAttempts: 5,
  },

  // UI settings
  ui: {
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    errorColor: '#ef4444',
    successColor: '#10b981',
    warningColor: '#f59e0b',
  },

  // Feature flags
  features: {
    qrCodeScanning: true,
    manualPairing: true,
    pushNotifications: true,
    deviceManagement: true,
  },

  // Development settings
  debug: __DEV__,
  logLevel: __DEV__ ? 'debug' : 'error',
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  verifyPairingCode: '/api/pairing/verify',
  completePairing: '/api/pairing/complete',

  // Authentication requests
  approveAuth: '/api/auth/approve',
  denyAuth: '/api/auth/deny',

  // Device management
  getDevices: '/api/devices',
  deleteDevice: '/api/devices/:deviceId',

  // User
  getUserProfile: '/api/user/profile',
  updateSettings: '/api/user/settings',
};

/**
 * Storage Keys
 * Keys used for SecureStore storage
 */
export const STORAGE_KEYS = {
  deviceId: 'deviceId',
  pairingToken: 'pairingToken',
  userId: 'userId',
  deviceName: 'deviceName',
  lastSync: 'lastSync',
  settings: 'userSettings',
};

/**
 * WebSocket Events
 */
export const WS_EVENTS = {
  // Connection events
  connect: 'connect',
  disconnect: 'disconnect',
  error: 'error',
  reconnect: 'reconnect',

  // Authentication events
  authRequest: 'auth-request',
  authApproved: 'auth-approved',
  authDenied: 'auth-denied',
  authTimeout: 'auth-timeout',

  // Device events
  devicePaired: 'device-paired',
  deviceUnpaired: 'device-unpaired',
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  network: 'Network connection failed. Please check your internet connection.',
  timeout: 'Request timed out. Please try again.',
  unauthorized: 'Unauthorized. Please pair your device again.',
  invalidCode: 'Invalid pairing code. Please try again.',
  biometricFailed: 'Biometric authentication failed. Please try again.',
  biometricNotAvailable: 'Biometric authentication is not available on this device.',
  serverError: 'Server error occurred. Please try again later.',
  unknown: 'An unexpected error occurred. Please try again.',
};

/**
 * Helper function to get full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${APP_CONFIG.apiUrl}${endpoint}`;
};

/**
 * Helper function to get WebSocket URL
 * @returns {string} WebSocket URL
 */
export const getWsUrl = () => {
  return APP_CONFIG.wsUrl;
};

/**
 * Helper function to check if feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (feature) => {
  return APP_CONFIG.features[feature] || false;
};

/**
 * Helper function to get error message
 * @param {string} errorType - Type of error
 * @returns {string} Error message
 */
export const getErrorMessage = (errorType) => {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES.unknown;
};

/**
 * Development helper to update API URL at runtime
 * Only works in development mode
 * @param {string} url - New API URL
 */
export const setDevApiUrl = (url) => {
  if (__DEV__) {
    APP_CONFIG.apiUrl = url;
    APP_CONFIG.wsUrl = url.replace('http', 'ws');
    console.log(`API URL updated to: ${url}`);
  } else {
    console.warn('Cannot change API URL in production mode');
  }
};

export default APP_CONFIG;
