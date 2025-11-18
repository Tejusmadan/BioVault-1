import React, { useState, useEffect } from 'react';

function AddPasswordModal({ password, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    username: '',
    password: '',
    category: 'other',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (password) {
      setFormData({
        title: password.title || '',
        url: password.url || '',
        username: password.username || '',
        password: password.password || '',
        category: password.category || 'other',
        notes: password.notes || ''
      });
    }
  }, [password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Failed to save password');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{password ? 'Edit Password' : 'Add New Password'}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Facebook, Gmail, Bank of America"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username / Email *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter or generate password"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={generatePassword}
                style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}
              >
                Generate
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="social">Social</option>
              <option value="banking">Banking</option>
              <option value="email">Email</option>
              <option value="work">Work</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or security questions"
              rows="3"
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : password ? 'Update Password' : 'Add Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPasswordModal;
