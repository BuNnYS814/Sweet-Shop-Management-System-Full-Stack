import { useState, useEffect } from 'react';
import { authAPI } from './api';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';

// Professional color palette
const colors = {
  primary: '#6366f1',      // Indigo
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  secondary: '#ec4899',    // Pink
  success: '#10b981',      // Green
  danger: '#ef4444',       // Red
  warning: '#f59e0b',       // Amber
  info: '#3b82f6',         // Blue
  dark: '#1f2937',         // Gray
  light: '#f9fafb',
  white: '#ffffff',
  border: '#e5e7eb',
  text: '#374151',
  textLight: '#6b7280',
};

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Check if user is logged in on mount
  useEffect(() => {
    if (token && !user) {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setToken('');
        localStorage.removeItem('token');
      }
    }
  }, [token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const data = await authAPI.login(email, password);
        setToken(data.access_token);
        const userData = { email: data.email, is_admin: data.is_admin };
        setUser(userData);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        setMessage('Login successful! Redirecting...');
        setEmail('');
        setPassword('');
        setTimeout(() => setMessage(''), 1000);
      } else {
        await authAPI.register(email, password);
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMessage('Logged out successfully');
    setTimeout(() => setMessage(''), 2000);
  };

  // If logged in, show dashboard or admin panel
  if (token && user) {
    if (user.is_admin) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          padding: '20px'
        }}>
          <AdminPanel user={user} onLogout={handleLogout} colors={colors} />
        </div>
      );
    } else {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          padding: '20px'
        }}>
          <Dashboard user={user} onLogout={handleLogout} colors={colors} />
        </div>
      );
    }
  }

  // Login/Register form
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        background: colors.white,
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '420px',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          button:hover { transform: translateY(-2px); transition: all 0.2s; }
          button:active { transform: translateY(0); }
        `}</style>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '56px', marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>🍬</div>
          <h1 style={{ 
            color: colors.primary,
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Sweet Shop
          </h1>
          <p style={{ color: colors.textLight, marginTop: '8px', fontSize: '14px' }}>
            Your favorite sweets, just a click away
          </p>
        </div>

        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          gap: '8px',
          background: colors.light,
          padding: '4px',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              background: isLogin ? colors.primary : 'transparent',
              color: isLogin ? colors.white : colors.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: isLogin ? '600' : '400',
              transition: 'all 0.2s',
              fontSize: '15px'
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              background: !isLogin ? colors.primary : 'transparent',
              color: !isLogin ? colors.white : colors.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: !isLogin ? '600' : '400',
              transition: 'all 0.2s',
              fontSize: '15px'
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>
          {isLogin && (
            <div style={{ 
              marginBottom: '16px', 
              fontSize: '12px', 
              color: colors.textLight, 
              textAlign: 'center',
              padding: '10px',
              background: colors.light,
              borderRadius: '6px'
            }}>
              <strong>Demo Admin:</strong> admin@sweetshop.com / admin123
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? colors.textLight : colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : `0 4px 12px ${colors.primary}40`
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: message.includes('successful') || message.includes('Redirecting') ? 
              `${colors.success}15` : `${colors.danger}15`,
            color: message.includes('successful') || message.includes('Redirecting') ? 
              colors.success : colors.danger,
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            border: `1px solid ${message.includes('successful') || message.includes('Redirecting') ? 
              colors.success : colors.danger}40`
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
