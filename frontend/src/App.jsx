import { useState } from 'react';
import { authAPI } from './api';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      if (isLogin) {
        const data = await authAPI.login(email, password);
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        setMessage('Login successful!');
      } else {
        await authAPI.register(email, password);
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setMessage('Logged out');
  };

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
        <h1 style={{ 
          textAlign: 'center', 
          color: '#667eea',
          marginBottom: '30px',
          fontSize: '2rem'
        }}>
          🍬 Sweet Shop
        </h1>

        {token ? (
          <div>
            <p style={{ textAlign: 'center', color: 'green', marginBottom: '20px' }}>
              ✅ You are logged in!
            </p>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  background: isLogin ? '#667eea' : '#e0e0e0',
                  color: isLogin ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  padding: '10px 20px',
                  background: !isLogin ? '#667eea' : '#e0e0e0',
                  color: !isLogin ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
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
          </>
        )}

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

