import React, { useState } from 'react';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { ProtectedDashboard } from './components/ProtectedDashboard';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  if (token) {
    return <ProtectedDashboard onLogout={handleLogout} />;
  }

  return isSignUp ? (
    <SignUp
      onAuthSuccess={handleAuthSuccess}
      onSwitchToLogin={() => setIsSignUp(false)}
    />
  ) : (
    <Login
      onAuthSuccess={handleAuthSuccess}
      onSwitchToSignUp={() => setIsSignUp(true)}
    />
  );
};

export default App;