import { useState, useEffect } from 'react';
import { sweetsAPI } from './api';

function Dashboard({ user, onLogout }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setMessage('');
      const data = await sweetsAPI.getAll();
      setSweets(data || []);
    } catch (error) {
      console.error('Error loading sweets:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to load sweets';
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    try {
      await sweetsAPI.purchase(sweetId, quantity);
      setMessage('Purchase successful!');
      loadSweets(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Purchase failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#667eea' }}>
        Loading sweets...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#667eea', margin: 0 }}>🍬 Sweet Shop Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>Welcome, {user.email}</span>
          {user.is_admin && (
            <span style={{ 
              background: '#ff6b6b', 
              color: 'white', 
              padding: '5px 10px', 
              borderRadius: '5px',
              fontSize: '12px'
            }}>
              ADMIN
            </span>
          )}
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          background: message.includes('successful') ? '#d4edda' : '#f8d7da',
          color: message.includes('successful') ? '#155724' : '#721c24',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {sweets.map(sweet => (
          <div key={sweet.id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{sweet.name}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Category: {sweet.category}
            </p>
            <p style={{ margin: '0 0 10px 0', color: '#667eea', fontSize: '18px', fontWeight: 'bold' }}>
              ${sweet.price.toFixed(2)}
            </p>
            <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
              Stock: {sweet.quantity}
            </p>
            <button
              onClick={() => handlePurchase(sweet.id, 1)}
              disabled={sweet.quantity === 0}
              style={{
                padding: '10px',
                background: sweet.quantity > 0 ? '#667eea' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: sweet.quantity > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>

      {sweets.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No sweets available.</p>
          {user.is_admin ? (
            <p>Add some sweets in the admin panel!</p>
          ) : (
            <p>Please contact an administrator.</p>
          )}
          <button
            onClick={loadSweets}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

