import React, { useState } from 'react';

function PasswordCard({ password, onEdit, onDelete, onCopy }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(password.username);
      alert('Username copied to clipboard!');
    } catch (err) {
      alert('Failed to copy username');
    }
  };

  const handleCopyPassword = () => {
    onCopy(password.id);
  };

  const maskPassword = (pwd) => {
    return '•'.repeat(pwd.length);
  };

  const getCategoryColor = (category) => {
    const colors = {
      social: '#3b82f6',
      banking: '#10b981',
      email: '#8b5cf6',
      work: '#f59e0b',
      shopping: '#ec4899',
      entertainment: '#ef4444',
      other: '#6b7280'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="password-card">
      <div className="password-card-header">
        <div className="password-card-info">
          <h3 className="password-card-title">{password.title}</h3>
          <a
            href={password.url}
            target="_blank"
            rel="noopener noreferrer"
            className="password-card-url"
            onClick={(e) => e.stopPropagation()}
          >
            {password.url}
          </a>
        </div>
        <div className="password-card-actions">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(password);
            }}
            title="Edit"
          >
            &#9998;
          </button>
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(password.id);
            }}
            title="Delete"
          >
            &#128465;
          </button>
        </div>
      </div>

      <div className="password-card-details">
        <div className="password-detail">
          <label>Username</label>
          <div className="password-detail-value">
            <span>{password.username}</span>
            <button className="icon-btn" onClick={handleCopyUsername} title="Copy username">
              &#128203;
            </button>
          </div>
        </div>

        <div className="password-detail">
          <label>Password</label>
          <div className="password-detail-value">
            <span>{showPassword ? password.password : maskPassword(password.password)}</span>
            <button
              className="icon-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '&#128065;' : '&#128584;'}
            </button>
            <button className="icon-btn" onClick={handleCopyPassword} title="Copy password">
              &#128203;
            </button>
          </div>
        </div>

        {password.notes && (
          <div className="password-detail">
            <label>Notes</label>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              {password.notes}
            </div>
          </div>
        )}
      </div>

      <div
        className="category-tag"
        style={{ background: getCategoryColor(password.category) }}
      >
        {password.category.charAt(0).toUpperCase() + password.category.slice(1)}
      </div>
    </div>
  );
}

export default PasswordCard;
