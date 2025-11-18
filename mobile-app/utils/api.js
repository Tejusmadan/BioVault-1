import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import io from 'socket.io-client';
import { APP_CONFIG } from './config';

// Configure API base URL from config
const API_BASE_URL = APP_CONFIG.apiUrl;

let socketInstance = null;

/**
 * API Helper Functions
 */
export const api = {
  /**
   * Verify a pairing code scanned from QR
   * @param {string} pairingCode - The code from the QR scan
   * @returns {Promise} Response with pairing session details
   */
  verifyPairingCode: async (pairingCode) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/pairing/verify`, {
        pairingCode,
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying pairing code:', error);
      throw error;
    }
  },

  /**
   * Complete the pairing process with biometric data
   * @param {string} sessionId - The pairing session ID
   * @param {string} deviceName - Name of the mobile device
   * @param {object} biometricData - Biometric authentication result
   * @returns {Promise} Response with device credentials
   */
  completePairing: async (sessionId, deviceName, biometricData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/pairing/complete`, {
        sessionId,
        deviceName,
        biometricData,
      });

      // Store device credentials securely
      if (response.data.success) {
        await SecureStore.setItemAsync('deviceId', response.data.deviceId);
        await SecureStore.setItemAsync('pairingToken', response.data.token);
        await SecureStore.setItemAsync('userId', response.data.userId);
      }

      return response.data;
    } catch (error) {
      console.error('Error completing pairing:', error);
      throw error;
    }
  },

  /**
   * Approve an authentication request
   * @param {string} requestId - The auth request ID
   * @param {object} biometricData - Biometric authentication result
   * @returns {Promise} Response confirming approval
   */
  approveAuthRequest: async (requestId, biometricData) => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const token = await SecureStore.getItemAsync('pairingToken');

      const response = await axios.post(
        `${API_BASE_URL}/api/auth-request/approve`,
        {
          requestId,
          deviceId,
          biometricConfirmed: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error approving auth request:', error);
      throw error;
    }
  },

  /**
   * Deny an authentication request
   * @param {string} requestId - The auth request ID
   * @returns {Promise} Response confirming denial
   */
  denyAuthRequest: async (requestId) => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const token = await SecureStore.getItemAsync('pairingToken');

      const response = await axios.post(
        `${API_BASE_URL}/api/auth-request/deny`,
        {
          requestId,
          deviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error denying auth request:', error);
      throw error;
    }
  },

  /**
   * Get list of paired devices for the user
   * @returns {Promise} Array of paired devices
   */
  getPairedDevices: async () => {
    try {
      const token = await SecureStore.getItemAsync('pairingToken');
      const userId = await SecureStore.getItemAsync('userId');

      const response = await axios.get(`${API_BASE_URL}/api/devices`, {
        params: {
          userId: userId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching paired devices:', error);
      throw error;
    }
  },

  /**
   * Unpair this device
   * @returns {Promise} Response confirming unpair
   */
  unpairDevice: async () => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const token = await SecureStore.getItemAsync('pairingToken');

      console.log('Unpair request - API_BASE_URL:', API_BASE_URL);
      console.log('Unpair request - deviceId:', deviceId);
      console.log('Unpair request - URL:', `${API_BASE_URL}/api/devices/${deviceId}`);

      const response = await axios.delete(
        `${API_BASE_URL}/api/devices/${deviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear stored credentials
      await SecureStore.deleteItemAsync('deviceId');
      await SecureStore.deleteItemAsync('pairingToken');
      await SecureStore.deleteItemAsync('userId');

      return response.data;
    } catch (error) {
      console.error('Error unpairing device:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },
};

/**
 * WebSocket connection for real-time auth requests
 */
export const socketManager = {
  /**
   * Connect to WebSocket server
   * @param {Function} onAuthRequest - Callback for incoming auth requests
   * @returns {Promise<Socket>} Socket instance
   */
  connect: async (onAuthRequest) => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const token = await SecureStore.getItemAsync('pairingToken');

      if (!deviceId || !token) {
        throw new Error('Device not paired');
      }

      if (socketInstance && socketInstance.connected) {
        return socketInstance;
      }

      socketInstance = io(API_BASE_URL, {
        auth: {
          token,
          deviceId,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });

      socketInstance.on('connect', async () => {
        console.log('WebSocket connected');

        // Register this device with the WebSocket server
        const userId = await SecureStore.getItemAsync('userId');
        const deviceId = await SecureStore.getItemAsync('deviceId');

        if (userId && deviceId) {
          socketInstance.emit('message', JSON.stringify({
            type: 'register',
            userId,
            deviceId
          }));
          console.log('Registered with WebSocket:', { userId, deviceId });
        }
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      });

      socketInstance.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Handle incoming messages from server
      socketInstance.on('message', (rawMessage) => {
        try {
          const message = JSON.parse(rawMessage);
          console.log('Received WebSocket message:', message);

          if (message.type === 'auth_request') {
            console.log('Auth request received:', message);
            if (onAuthRequest) {
              onAuthRequest({
                requestId: message.requestId,
                context: message.context,
                timestamp: message.timestamp,
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      socketInstance.on('auth-request', (data) => {
        console.log('Received auth request (direct):', data);
        if (onAuthRequest) {
          onAuthRequest(data);
        }
      });

      return socketInstance;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      throw error;
    }
  },

  /**
   * Disconnect from WebSocket server
   */
  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  },

  /**
   * Get current socket instance
   * @returns {Socket|null} Current socket instance
   */
  getSocket: () => {
    return socketInstance;
  },
};

/**
 * Update API base URL (for configuration)
 * @param {string} url - New base URL
 */
export const setApiBaseUrl = (url) => {
  API_BASE_URL = url;
};

export default api;
