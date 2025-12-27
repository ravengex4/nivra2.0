
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, User, Alert } from './types';
import PatientDashboard from './views/PatientDashboard';
import CaretakerDashboard from './views/CaretakerDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import HealthRecords from './views/HealthRecords';
import Marketplace from './views/Marketplace';
import Profile from './views/Profile';
import Auth from './views/Auth';
import AlertBanner from './components/AlertBanner';
import BottomNav, { TabType } from './components/BottomNav';
import { Shield, Loader2 } from 'lucide-react';
import { IMAGE_ASSETS } from './assets/images';
import SmartImage from './components/SmartImage';
import BandImage from './assets/C21hatGPT_Image_Dec_27__2025__07_46_49_PM-removebg-preview.png';

const StartupScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing System...');

  useEffect(() => {
    const messages = [
      'Establishing Neural Link...',
      'Verifying Biometric Hash...',
      'Syncing Cloud Protocols...',
      'System Ready.'
    ];
    
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < messages.length - 1) {
        msgIndex++;
        setStatus(messages[msgIndex]);
      }
    }, 800);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          clearInterval(msgInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        const step = Math.random() * 15;
        return Math.min(100, prev + step);
      });
    }, 150);

    return () => {
      clearInterval(timer);
      clearInterval(msgInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Central Graphical Element */}
        <div className="relative mb-16">
          {/* Animated Rings */}
          <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute -inset-4 rounded-full border border-indigo-500/10 border-dashed animate-[spin_15s_linear_infinite_reverse]"></div>
          <div className="absolute -inset-12 rounded-full border border-indigo-500/5 animate-[spin_20s_linear_infinite]"></div>
          
          {/* Core Glow */}
          <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse"></div>

          {/* Logo Container */}
          <div className="relative bg-black/50 backdrop-blur-sm p-10 rounded-full border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.15)] flex items-center justify-center w-48 h-48 group">
            <div className="absolute inset-0 rounded-full bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
            <SmartImage 
              src={IMAGE_ASSETS.brand.logo} 
              alt="Nivra Brand Logo" 
              className="text-7xl text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]" 
            />
          </div>
        </div>

        {/* Typography & Status */}
        <div className="space-y-8 text-center w-full max-w-md px-6">
          <div>
            <h1 className="text-6xl font-black text-white tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              NIVRA
            </h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.6em] animate-pulse">
              Bio-Secure Systems
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-1">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                {status}
              </span>
              <span className="text-indigo-400">{Math.round(progress)}%</span>
            </div>
            
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-200 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="absolute bottom-8 w-full px-8 flex justify-between items-end text-[9px] font-mono text-zinc-800 uppercase tracking-widest select-none">
        <div className="flex flex-col gap-1">
          <span>ID: 84-92-X1</span>
          <span>Secure Enclave</span>
        </div>
        <div className="text-right">
          <span>v2.5.0-Flash-Core</span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isStarting, setIsStarting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'AUTH' | 'DASHBOARD'>('AUTH');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setView('AUTH');
    setActiveTab('dashboard');
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

  useEffect(() => {
    if (user?.role === UserRole.PATIENT) {
      const interval = setInterval(() => {
        if (Math.random() > 0.98) triggerEmergency();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, triggerEmergency]);

  const renderActiveTab = () => {
    if (!user) return null;
    if (activeTab === 'profile') return <Profile user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
    if (activeTab === 'records') return <HealthRecords user={user} />;
    if (activeTab === 'marketplace') return <Marketplace />;
    switch (user.role) {
      case UserRole.PATIENT: return <PatientDashboard user={user} onTabChange={setActiveTab} bandImage={BandImage} />;
      case UserRole.CARETAKER: return <CaretakerDashboard user={user} />;
      case UserRole.DOCTOR: return <DoctorDashboard user={user} onTabChange={setActiveTab} />;
      default: return null;
    }
  };

  if (isStarting) return <StartupScreen onComplete={() => setIsStarting(false)} />;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-300 animate-in fade-in duration-1000">
      {alerts.filter(a => a.active).map(alert => <AlertBanner key={alert.id} alert={alert} onDismiss={() => setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a))} />)}
      {view === 'AUTH' ? <Auth onLogin={handleLogin} /> : (
        <>
          <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-8 pb-24">{renderActiveTab()}</main>
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
};

export default App;
