import React, { useEffect, useState } from 'react';
import { getProfile, type UserProfileResponse } from '../services/api';
import { Dashboard } from '../pages/Dashboard';

interface ProtectedDashboardProps {
  onLogout: () => void;
}

export const ProtectedDashboard: React.FC<ProtectedDashboardProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (err) {
        // Token invalid or expired -> force logout
        onLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [onLogout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  return <Dashboard username={profile?.username || 'User'} onLogout={onLogout} />;
};