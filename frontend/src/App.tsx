import React, { useState } from 'react';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Handle successful login or sign up
  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>
      {token ? (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Authentication Successful!</h2>
          <p style={{ color: '#475569', wordBreak: 'break-all' }}>
            <strong>Access Token:</strong> {token}
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div>
          {isSignUp ? (
            <SignUp onAuthSuccess={handleAuthSuccess} />
          ) : (
            <Login onAuthSuccess={handleAuthSuccess} />
          )}

          {/* View Toggle */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem',
              }}
            >
              {isSignUp
                ? 'Already have an account? Log In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;