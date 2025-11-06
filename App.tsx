import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage';
import Header from './components/Header';

const AuthenticatedApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <Header onNavigate={setCurrentView} />
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'settings' && <SettingsPage onNavigateBack={() => setCurrentView('dashboard')} />}
    </div>
  );
};


function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen aurora-background flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading TimeVault...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
       <div className="relative z-10">
        {isAuthenticated ? <AuthenticatedApp /> : <AuthPage />}
       </div>
    </div>
  );
}

export default App;
