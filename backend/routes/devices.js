const express = require('express');
const router = express.Router();
const { addDevice, getDevices, removeDevice } = require('../db');

// Get all paired devices for a user
router.get('/', (req, res) => {
  try {
    const { deviceId, userId } = req.query;

    // If userId provided, use it directly
    if (userId) {
      const devices = getDevices(userId);
      return res.json({
        success: true,
        devices: devices
      });
    }

    // Otherwise, find user by device ID (for backward compatibility)
    // Note: This is inefficient, but works for prototype
    // In production, use proper authentication middleware
    let userDevices = [];
    // Since we can't iterate through the Map from here, return empty for now
    // The mobile app should send userId after pairing

    res.json({
      success: true,
      devices: userDevices
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a paired device
router.post('/', (req, res) => {
  try {
    const { userId, deviceId, deviceName } = req.body;

    const device = addDevice(userId, deviceId, deviceName);

    res.json({
      success: true,
      device: device
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a paired device
router.delete('/:deviceId', (req, res) => {
  try {
    const { deviceId } = req.params;
    console.log('DELETE request for deviceId:', deviceId);

    const success = removeDevice(deviceId);
    console.log('removeDevice result:', success);

    if (success) {
      res.json({
        success: true,
        message: 'Device unpaired successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }
  } catch (error) {
    console.error('Error in DELETE /devices/:deviceId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
