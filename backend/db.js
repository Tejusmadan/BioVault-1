// In-memory database for prototype
// In production, this would connect to PostgreSQL

const vaults = new Map(); // userId -> passwords[]
const pairings = new Map(); // pairingCode -> { deviceId, userId, timestamp }
const pairedDevices = new Map(); // userId -> devices[]

function initDB() {
  console.log('Database initialized (in-memory)');

  // Add sample data for demo
  vaults.set('demo@biovault.com', [
    {
      id: '1',
      website: 'github.com',
      username: 'demo@biovault.com',
      password: 'encrypted_password_1',
      category: 'Development',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      website: 'google.com',
      username: 'demo@biovault.com',
      password: 'encrypted_password_2',
      category: 'Personal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
}

function getVault(userId) {
  return vaults.get(userId) || [];
}

function savePassword(userId, passwordEntry) {
  const userVault = vaults.get(userId) || [];
  const newEntry = {
    ...passwordEntry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  userVault.push(newEntry);
  vaults.set(userId, userVault);
  return newEntry;
}

function updatePassword(userId, passwordId, updates) {
  const userVault = vaults.get(userId) || [];
  const index = userVault.findIndex(p => p.id === passwordId);

  if (index !== -1) {
    userVault[index] = {
      ...userVault[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    vaults.set(userId, userVault);
    return userVault[index];
  }
  return null;
}

function deletePassword(userId, passwordId) {
  const userVault = vaults.get(userId) || [];
  const filtered = userVault.filter(p => p.id !== passwordId);
  vaults.set(userId, filtered);
  return filtered.length < userVault.length;
}

function createPairing(pairingCode, deviceId, userId) {
  pairings.set(pairingCode, {
    deviceId,
    userId,
    timestamp: Date.now(),
    expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
  });
  return pairingCode;
}

function verifyPairing(pairingCode) {
  const pairing = pairings.get(pairingCode);
  if (!pairing) return null;

  if (Date.now() > pairing.expiresAt) {
    pairings.delete(pairingCode);
    return null;
  }

  return pairing;
}

function completePairing(pairingCode) {
  const pairing = pairings.get(pairingCode);
  if (pairing) {
    pairings.delete(pairingCode);
    return pairing;
  }
  return null;
}

function addDevice(userId, deviceId, deviceName) {
  const devices = pairedDevices.get(userId) || [];

  // Check if device already exists
  const existingDevice = devices.find(d => d.deviceId === deviceId);
  if (existingDevice) {
    return existingDevice;
  }

  const newDevice = {
    deviceId,
    deviceName: deviceName || 'My Device',
    pairedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    deviceType: 'mobile'
  };

  devices.push(newDevice);
  pairedDevices.set(userId, devices);
  return newDevice;
}

function getDevices(userId) {
  return pairedDevices.get(userId) || [];
}

function removeDevice(deviceId) {
  console.log('removeDevice called with deviceId:', deviceId);
  console.log('Current pairedDevices Map size:', pairedDevices.size);

  // Find and remove device from all users
  for (const [userId, devices] of pairedDevices.entries()) {
    console.log(`Checking userId: ${userId}, devices:`, devices);
    const filtered = devices.filter(d => d.deviceId !== deviceId);
    if (filtered.length < devices.length) {
      console.log('Device found and removed for userId:', userId);
      pairedDevices.set(userId, filtered);
      return true;
    }
  }
  console.log('Device not found in any user storage');
  return false;
}

module.exports = {
  initDB,
  getVault,
  savePassword,
  updatePassword,
  deletePassword,
  createPairing,
  verifyPairing,
  completePairing,
  addDevice,
  getDevices,
  removeDevice
};
