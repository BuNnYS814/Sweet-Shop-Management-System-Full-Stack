import { useState, useEffect } from 'react';
import { authAPI } from './api';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Check if user is logged in on mount
  useEffect(() => {
    if (token && !user) {
      // Token exists but user info missing, try to get from storage or logout
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Invalid state, clear token
        setToken('');
        localStorage.removeItem('token');
      }
    }
  }, [token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      if (isLogin) {
        const data = await authAPI.login(email, password);
        setToken(data.access_token);
        const userData = { email: data.email, is_admin: data.is_admin };
        setUser(userData);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        setMessage('Login successful!');
        setEmail('');
        setPassword('');
      } else {
        await authAPI.register(email, password);
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'An error occurred');
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}>
          <AdminPanel user={user} onLogout={handleLogout} />
        </div>
      );
    } else {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}>
          <Dashboard user={user} onLogout={handleLogout} />
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🍬</div>
          <h1 style={{ 
            color: '#667eea',
            margin: 0,
            fontSize: '2rem'
          }}>
            Sweet Shop
          </h1>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
            }}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: isLogin ? '#667eea' : '#e0e0e0',
              color: isLogin ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: isLogin ? 'bold' : 'normal'
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
              padding: '10px 20px',
              background: !isLogin ? '#667eea' : '#e0e0e0',
              color: !isLogin ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: !isLogin ? 'bold' : 'normal'
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {isLogin && (
            <div style={{ marginBottom: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              Admin: admin@sweetshop.com / admin123
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '20px',
            padding: '10px',
            background: message.includes('successful') || message.includes('logged in') ? '#d4edda' : '#f8d7da',
            color: message.includes('successful') || message.includes('logged in') ? '#155724' : '#721c24',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
