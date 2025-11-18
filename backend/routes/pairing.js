const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { createPairing, verifyPairing, completePairing, addDevice } = require('../db');
const { authMiddleware } = require('../auth');

// Generate/Request new pairing code
const generatePairingCode = (req, res) => {
  try {
    const { deviceId } = req.body;
    const userId = req.user.email;

    // Generate 6-character pairing code
    const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    createPairing(pairingCode, deviceId || uuidv4(), userId);

    res.json({
      success: true,
      pairingCode,
      expiresIn: 300 // 5 minutes in seconds
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Both /request and /generate work (for compatibility)
router.post('/request', authMiddleware, generatePairingCode);
router.post('/generate', authMiddleware, generatePairingCode);

// Verify pairing code (called by mobile app)
router.post('/verify', (req, res) => {
  try {
    const { pairingCode } = req.body;

    const pairing = verifyPairing(pairingCode);

    if (pairing) {
      res.json({
        success: true,
        message: 'Pairing code valid',
        userId: pairing.userId,
        sessionId: pairingCode  // Return the pairing code as sessionId for mobile app
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Invalid or expired pairing code'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete pairing (called by mobile app after biometric auth)
router.post('/complete', (req, res) => {
  try {
    const { sessionId, deviceName, biometricData, pairingCode, biometricConfirmed } = req.body;

    // Support both old and new API formats
    const code = pairingCode || sessionId;
    const confirmed = biometricConfirmed || (biometricData && biometricData.success);

    if (!confirmed) {
      return res.status(400).json({
        success: false,
        error: 'Biometric authentication required'
      });
    }

    const pairing = completePairing(code);

    if (pairing) {
      console.log('Pairing completed:', pairing);

      // Register the device in the database
      const device = addDevice(pairing.userId, pairing.deviceId, deviceName);
      console.log('Device registered:', device);

      // Generate a token for the device
      const token = Math.random().toString(36).substring(2);

      res.json({
        success: true,
        message: 'Device paired successfully',
        userId: pairing.userId,
        deviceId: pairing.deviceId,
        token: token
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Invalid or expired pairing code'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
