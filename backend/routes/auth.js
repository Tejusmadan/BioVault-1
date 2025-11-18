const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Store pending auth requests in memory
const authRequests = new Map(); // requestId -> { userId, status, timestamp, deviceId }

// Request authentication (called by web dashboard)
router.post('/request', (req, res) => {
  try {
    const { userId, context } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const requestId = uuidv4();
    const authRequest = {
      requestId,
      userId,
      status: 'pending',
      timestamp: Date.now(),
      context: context || 'Web Dashboard Login',
      expiresAt: Date.now() + (2 * 60 * 1000) // 2 minutes
    };

    authRequests.set(requestId, authRequest);

    console.log('Auth request created:', authRequest);

    // Broadcast to connected mobile devices via WebSocket
    if (global.broadcastAuthRequest) {
      global.broadcastAuthRequest(userId, requestId, context);
    }

    res.json({
      success: true,
      requestId,
      message: 'Authentication request created'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check auth request status (polling from web dashboard)
router.get('/status/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const authRequest = authRequests.get(requestId);

    if (!authRequest) {
      return res.status(404).json({
        success: false,
        error: 'Auth request not found or expired'
      });
    }

    // Check if expired
    if (Date.now() > authRequest.expiresAt) {
      authRequests.delete(requestId);
      return res.status(408).json({
        success: false,
        error: 'Auth request expired',
        status: 'expired'
      });
    }

    res.json({
      success: true,
      status: authRequest.status,
      requestId: authRequest.requestId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve auth request (called by mobile app)
router.post('/approve', (req, res) => {
  try {
    const { requestId, biometricConfirmed } = req.body;

    if (!requestId) {
      return res.status(400).json({ success: false, error: 'requestId is required' });
    }

    const authRequest = authRequests.get(requestId);

    if (!authRequest) {
      return res.status(404).json({
        success: false,
        error: 'Auth request not found or expired'
      });
    }

    if (!biometricConfirmed) {
      return res.status(400).json({
        success: false,
        error: 'Biometric confirmation required'
      });
    }

    authRequest.status = 'approved';
    authRequest.approvedAt = Date.now();
    authRequests.set(requestId, authRequest);

    console.log('Auth request approved:', requestId);

    res.json({
      success: true,
      message: 'Authentication approved'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deny auth request (called by mobile app)
router.post('/deny', (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ success: false, error: 'requestId is required' });
    }

    const authRequest = authRequests.get(requestId);

    if (!authRequest) {
      return res.status(404).json({
        success: false,
        error: 'Auth request not found'
      });
    }

    authRequest.status = 'denied';
    authRequest.deniedAt = Date.now();
    authRequests.set(requestId, authRequest);

    console.log('Auth request denied:', requestId);

    res.json({
      success: true,
      message: 'Authentication denied'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get pending auth requests for a user (called by mobile app)
router.get('/pending/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const pendingRequests = [];
    for (const [requestId, request] of authRequests.entries()) {
      if (request.userId === userId && request.status === 'pending') {
        // Check if not expired
        if (Date.now() <= request.expiresAt) {
          pendingRequests.push(request);
        } else {
          authRequests.delete(requestId);
        }
      }
    }

    res.json({
      success: true,
      requests: pendingRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
