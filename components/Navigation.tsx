
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { LogOut, Sun, Moon, User as UserIcon, Shield } from 'lucide-react';

interface Props {
  user: User | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<Props> = ({ user, isDarkMode, toggleTheme, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we've scrolled down and we're not at the very top
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        // We're scrolling up or at the top
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      // Close profile menu on scroll to keep UI clean
      if (showProfile) setShowProfile(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showProfile]);

  return (
    <nav 
      className={`sticky top-0 z-40 bg-white/90 dark:bg-black/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 px-4 py-3 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 p-1.5 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Nivra
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 pl-3 rounded-full border border-slate-100 dark:border-zinc-800 hover:shadow-sm transition-all bg-white dark:bg-black"
            >
              <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4 text-slate-500 dark:text-zinc-400" />}
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-950 rounded-xl shadow-xl border border-slate-100 dark:border-zinc-800 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-50 dark:border-zinc-900">
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{user?.role}</p>
                </div>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-2 dark:text-zinc-200 transition-colors">
                  <UserIcon className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
