import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { API_URL } from '../config';

function PairingModal({ onClose }) {
  const [pairingData, setPairingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    generatePairingCode();
  }, []);

  const generatePairingCode = async () => {
    try {
      const token = localStorage.getItem('biovault_token');
      const response = await axios.post(
        `${API_URL}/pairing/generate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPairingData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate pairing code');
      setLoading(false);
    }
  };

  const qrData = pairingData
    ? JSON.stringify({
        code: pairingData.pairingCode,
        server: API_URL
      })
    : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pair New Device</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="qr-code-container">
              <QRCode value={qrData} size={256} level="H" />
              <div className="qr-code-info">
                <h3>Scan with BioVault App</h3>
                <p>Open the BioVault mobile app and scan this QR code</p>
                <p>to pair your device</p>
                <div className="pairing-code">{pairingData.pairingCode}</div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  Code expires in 5 minutes
                </p>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#1e293b' }}>
                How to pair:
              </h3>
              <ol style={{ paddingLeft: '20px', color: '#64748b', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Open the BioVault mobile app</li>
                <li>Go to Settings and tap "Pair Device"</li>
                <li>Scan this QR code with your camera</li>
                <li>Complete biometric authentication on your device</li>
              </ol>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={onClose} style={{ flex: 'none', width: '100%' }}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PairingModal;
