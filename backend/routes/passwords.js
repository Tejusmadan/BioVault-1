const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../auth');
const { getVault, savePassword, updatePassword, deletePassword } = require('../db');

// Get all passwords for user
router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.email;
    const vault = getVault(userId);
    res.json({ success: true, passwords: vault });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new password
router.post('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.email;
    const { website, username, password, category, notes } = req.body;

    const newPassword = savePassword(userId, {
      website,
      username,
      password,
      category: category || 'Uncategorized',
      notes: notes || ''
    });

    res.json({ success: true, password: newPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update password
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const userId = req.user.email;
    const passwordId = req.params.id;
    const updates = req.body;

    const updated = updatePassword(userId, passwordId, updates);

    if (updated) {
      res.json({ success: true, password: updated });
    } else {
      res.status(404).json({ success: false, error: 'Password not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete password
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const userId = req.user.email;
    const passwordId = req.params.id;

    const deleted = deletePassword(userId, passwordId);

    if (deleted) {
      res.json({ success: true, message: 'Password deleted' });
    } else {
      res.status(404).json({ success: false, error: 'Password not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
