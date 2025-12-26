
import React, { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { UserRole, User, Alert } from './types';
import PatientDashboard from './views/PatientDashboard';
import CaretakerDashboard from './views/CaretakerDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import Auth from './views/Auth';
import Navigation from './components/Navigation';
import AlertBanner from './components/AlertBanner';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-900 p-4">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Application Error</h2>
            <p className="mb-4">{this.state.error?.message}</p>
            <p className="text-sm mb-4 text-red-700">If this is an API Key error, please check your environment configuration.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'AUTH' | 'DASHBOARD'>('AUTH');

  // Detect and synchronize with device system preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  // Update HTML class for Tailwind darkMode: 'class' strategy
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setView('AUTH');
  };

  const triggerEmergency = useCallback(() => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'PREDICTION',
      message: 'High risk of seizure detected in ~5 minutes!',
      timestamp: new Date().toISOString(),
      active: true,
      countdown: 300,
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  // Mock real-time data monitoring for prediction simulation
  useEffect(() => {
    if (user?.role === UserRole.PATIENT) {
      const interval = setInterval(() => {
        if (Math.random() > 0.98) {
          triggerEmergency();
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, triggerEmergency]);

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.PATIENT:
        return <PatientDashboard user={user} />;
      case UserRole.CARETAKER:
        return <CaretakerDashboard user={user} />;
      case UserRole.DOCTOR:
        return <DoctorDashboard user={user} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-300 pb-20">
        {alerts.filter(a => a.active).map(alert => (
          <AlertBanner 
            key={alert.id} 
            alert={alert} 
            onDismiss={() => setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a))} 
          />
        ))}

        {view === 'AUTH' ? (
          <Auth onLogin={handleLogin} />
        ) : (
          <>
            <Navigation 
              user={user} 
              isDarkMode={isDarkMode} 
              toggleTheme={() => setIsDarkMode(!isDarkMode)} 
              onLogout={handleLogout} 
            />
            <main className="max-w-4xl mx-auto px-4 pt-4">
              {renderDashboard()}
            </main>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
