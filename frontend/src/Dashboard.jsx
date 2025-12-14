import { useState, useEffect } from 'react';
import { sweetsAPI } from './api';

function Dashboard({ user, onLogout, colors }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setMessage('');
      const data = await sweetsAPI.getAll();
      setSweets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading sweets:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to load sweets. Please refresh.';
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    try {
      setPurchasing(sweetId);
      setMessage('');
      await sweetsAPI.purchase(sweetId, quantity);
      setMessage('✅ Purchase successful!');
      loadSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Purchase failed. Please try again.';
      setMessage(`❌ ${errorMsg}`);
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: colors.white,
        borderRadius: '16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍬</div>
        <div style={{ color: colors.primary, fontSize: '18px', fontWeight: '500' }}>
          Loading delicious sweets...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: colors.white,
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      minHeight: 'calc(100vh - 40px)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `2px solid ${colors.border}`
      }}>
        <div>
          <h1 style={{ 
            color: colors.primary, 
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🍬</span> Sweet Shop Dashboard
          </h1>
          <p style={{ color: colors.textLight, margin: '8px 0 0 0', fontSize: '14px' }}>
            Welcome back, {user.email.split('@')[0]}!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user.is_admin && (
            <span style={{ 
              background: colors.warning, 
              color: colors.white, 
              padding: '6px 12px', 
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Admin
            </span>
          )}
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: colors.danger,
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: `0 2px 8px ${colors.danger}40`
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '14px 20px',
          marginBottom: '24px',
          background: message.includes('✅') ? `${colors.success}15` : `${colors.danger}15`,
          color: message.includes('✅') ? colors.success : colors.danger,
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '500',
          border: `1px solid ${message.includes('✅') ? colors.success : colors.danger}40`
        }}>
          {message}
        </div>
      )}

      {/* Sweets Grid */}
      {sweets.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {sweets.map(sweet => (
            <div key={sweet.id} style={{
              background: colors.white,
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              border: `2px solid ${colors.border}`,
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                borderRadius: '0 0 0 60px'
              }} />
              
              <h3 style={{ 
                margin: '0 0 12px 0', 
                color: colors.dark,
                fontSize: '20px',
                fontWeight: '600'
              }}>
                {sweet.name}
              </h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                padding: '6px 12px',
                background: colors.light,
                borderRadius: '20px',
                width: 'fit-content',
                fontSize: '13px',
                color: colors.textLight,
                fontWeight: '500'
              }}>
                <span>🏷️</span> {sweet.category}
              </div>
              
              <div style={{
                marginBottom: '16px',
                padding: '16px',
                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                borderRadius: '8px',
                border: `1px solid ${colors.primary}20`
              }}>
                <div style={{
                  color: colors.primary,
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  ${parseFloat(sweet.price).toFixed(2)}
                </div>
                <div style={{
                  color: colors.textLight,
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {sweet.quantity > 0 ? (
                    <span style={{ color: colors.success }}>✓ {sweet.quantity} in stock</span>
                  ) : (
                    <span style={{ color: colors.danger }}>✗ Out of stock</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handlePurchase(sweet.id, 1)}
                disabled={sweet.quantity === 0 || purchasing === sweet.id}
                style={{
                  marginTop: 'auto',
                  padding: '12px',
                  background: sweet.quantity > 0 && purchasing !== sweet.id ? 
                    `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : colors.border,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: sweet.quantity > 0 && purchasing !== sweet.id ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  boxShadow: sweet.quantity > 0 && purchasing !== sweet.id ? 
                    `0 4px 12px ${colors.primary}40` : 'none',
                  opacity: sweet.quantity === 0 ? 0.6 : 1
                }}
              >
                {purchasing === sweet.id ? 'Processing...' : 
                 sweet.quantity > 0 ? '🛒 Purchase Now' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: colors.light,
          borderRadius: '12px',
          border: `2px dashed ${colors.border}`
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍭</div>
          <h3 style={{ color: colors.dark, marginBottom: '12px' }}>No sweets available</h3>
          <p style={{ color: colors.textLight, marginBottom: '24px' }}>
            {user.is_admin 
              ? 'Add some delicious sweets in the admin panel!' 
              : 'Please check back later or contact an administrator.'}
          </p>
          <button
            onClick={loadSweets}
            style={{
              padding: '12px 24px',
              background: colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.2s',
              boxShadow: `0 4px 12px ${colors.primary}40`
            }}
          >
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
