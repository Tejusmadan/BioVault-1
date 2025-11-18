import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordCard from './PasswordCard';
import AddPasswordModal from './AddPasswordModal';
import PairingModal from './PairingModal';
import { API_URL } from '../config';

function Dashboard({ onLogout }) {
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [authRequestId, setAuthRequestId] = useState(null);
  const [authStatus, setAuthStatus] = useState('idle'); // idle, pending, approved, denied, expired

  const categories = ['all', 'social', 'banking', 'email', 'work', 'shopping', 'entertainment', 'other'];

  const fetchPasswords = async () => {
    try {
      const token = localStorage.getItem('biovault_token');
      const response = await axios.get(`${API_URL}/passwords`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend returns { success: true, passwords: [] }
      setPasswords(response.data.passwords || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch passwords:', err);
      setPasswords([]);
      setLoading(false);
      if (err.response?.status === 401) {
        onLogout();
      }
    }
  };

  useEffect(() => {
    fetchPasswords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterPasswords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwords, searchQuery, selectedCategory]);

  const filterPasswords = () => {
    let filtered = Array.isArray(passwords) ? passwords : [];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pwd => pwd.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(pwd =>
        pwd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pwd.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pwd.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPasswords(filtered);
  };

  const handleAddPassword = async (passwordData) => {
    try {
      const token = localStorage.getItem('biovault_token');
      if (editingPassword) {
        await axios.put(`${API_URL}/passwords/${editingPassword.id}`, passwordData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/passwords`, passwordData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchPasswords();
      setShowAddModal(false);
      setEditingPassword(null);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to save password');
    }
  };

  const handleEditPassword = (password) => {
    setEditingPassword(password);
    setShowAddModal(true);
  };

  const handleDeletePassword = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return;
    }

    try {
      const token = localStorage.getItem('biovault_token');
      await axios.delete(`${API_URL}/passwords/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPasswords();
    } catch (err) {
      alert('Failed to delete password');
    }
  };

  const handleCopyPassword = async (id) => {
    try {
      const token = localStorage.getItem('biovault_token');
      const response = await axios.get(`${API_URL}/passwords/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await navigator.clipboard.writeText(response.data.password);
      alert('Password copied to clipboard!');
    } catch (err) {
      alert('Failed to copy password');
    }
  };

  const handleAuthenticate = async () => {
    try {
      setAuthStatus('pending');
      const userEmail = localStorage.getItem('biovault_email') || 'demo@biovault.com';

      // Request authentication
      const response = await axios.post(`${API_URL}/auth-request/request`, {
        userId: userEmail,
        context: 'Web Dashboard Login'
      });

      const { requestId } = response.data;
      setAuthRequestId(requestId);

      // Poll for status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`${API_URL}/auth-request/status/${requestId}`);
          const { status } = statusResponse.data;

          if (status === 'approved') {
            clearInterval(pollInterval);
            setAuthStatus('approved');
            setTimeout(() => setAuthStatus('idle'), 3000);
          } else if (status === 'denied') {
            clearInterval(pollInterval);
            setAuthStatus('denied');
            setTimeout(() => setAuthStatus('idle'), 3000);
          }
        } catch (err) {
          if (err.response?.status === 408 || err.response?.status === 404) {
            // Expired or not found
            clearInterval(pollInterval);
            setAuthStatus('expired');
            setTimeout(() => setAuthStatus('idle'), 3000);
          }
        }
      }, 1000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (authStatus === 'pending') {
          setAuthStatus('expired');
          setTimeout(() => setAuthStatus('idle'), 3000);
        }
      }, 120000);

    } catch (err) {
      console.error('Authentication request failed:', err);
      alert('Failed to request authentication');
      setAuthStatus('idle');
    }
  };

  const getStats = () => {
    const total = passwords.length;
    const categories = [...new Set(passwords.map(p => p.category))].length;
    const recentlyAdded = passwords.filter(p => {
      const date = new Date(p.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length;

    return { total, categories, recentlyAdded };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <h1>BioVault</h1>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={() => setShowPairingModal(true)}>
            Pair Device
          </button>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Passwords</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Categories</h3>
            <div className="stat-value">{stats.categories}</div>
          </div>
          <div className="stat-card">
            <h3>Added This Week</h3>
            <div className="stat-value">{stats.recentlyAdded}</div>
          </div>
        </div>

        {/* Biometric Authentication Test */}
        <div style={{ marginBottom: '24px', marginTop: '24px' }}>
          <div style={{
            background: authStatus === 'approved' ? '#ecfdf5' : authStatus === 'denied' || authStatus === 'expired' ? '#fef2f2' : authStatus === 'pending' ? '#fffbeb' : '#f9fafb',
            border: `2px solid ${authStatus === 'approved' ? '#10b981' : authStatus === 'denied' || authStatus === 'expired' ? '#ef4444' : authStatus === 'pending' ? '#f59e0b' : '#e5e7eb'}`,
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                Biometric Authentication
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                {authStatus === 'idle' && 'Test the mobile biometric authentication flow'}
                {authStatus === 'pending' && 'Waiting for biometric confirmation on your mobile device...'}
                {authStatus === 'approved' && '✓ Authentication approved!'}
                {authStatus === 'denied' && '✗ Authentication denied'}
                {authStatus === 'expired' && '⏱ Request expired'}
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={handleAuthenticate}
              disabled={authStatus === 'pending'}
              style={{
                opacity: authStatus === 'pending' ? 0.6 : 1,
                cursor: authStatus === 'pending' ? 'not-allowed' : 'pointer'
              }}
            >
              {authStatus === 'pending' ? 'Waiting...' : 'Authenticate'}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <span className="search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add Password Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingPassword(null);
              setShowAddModal(true);
            }}
            style={{ width: 'auto', padding: '14px 32px' }}
          >
            + Add Password
          </button>
        </div>

        {/* Passwords Grid */}
        {filteredPasswords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">&#128274;</div>
            <h3>No passwords found</h3>
            <p>
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first password to get started'}
            </p>
            {passwords.length === 0 && (
              <button
                className="btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ marginTop: '16px' }}
              >
                Add Your First Password
              </button>
            )}
          </div>
        ) : (
          <div className="passwords-grid">
            {filteredPasswords.map(password => (
              <PasswordCard
                key={password.id}
                password={password}
                onEdit={handleEditPassword}
                onDelete={handleDeletePassword}
                onCopy={handleCopyPassword}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPasswordModal
          password={editingPassword}
          onClose={() => {
            setShowAddModal(false);
            setEditingPassword(null);
          }}
          onSave={handleAddPassword}
        />
      )}

      {showPairingModal && (
        <PairingModal onClose={() => setShowPairingModal(false)} />
      )}
    </div>
  );
}

export default Dashboard;
