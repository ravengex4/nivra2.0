
import React, { useState } from 'react';
import { User, DeviceStats, SeizureLog } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Bluetooth, Battery, Heart, Activity, Calendar, Wind, UserPlus, Clock, Zap, X, ChevronDown, Search, CheckCircle2 } from 'lucide-react';

const mockHistory: SeizureLog[] = [
  { id: '1', timestamp: '2023-10-24 14:30', duration: '2m 15s', severity: 'Moderate' },
  { id: '2', timestamp: '2023-10-21 09:12', duration: '1m 05s', severity: 'Mild' },
];

interface Country {
  name: string;
  code: string;
  flag: string;
  iso: string;
}

const countries: Country[] = [
  { name: 'United States', code: '+1', flag: '🇺🇸', iso: 'US' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', iso: 'GB' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', iso: 'PK' },
  { name: 'India', code: '+91', flag: '🇮🇳', iso: 'IN' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', iso: 'CA' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', iso: 'DE' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', iso: 'AU' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', iso: 'AE' },
];

const PatientDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [device] = useState<DeviceStats>({
    heartRate: 74,
    spo2: 98,
    hrv: 45,
    battery: 88,
    status: 'Connected'
  });

  // Add Caretaker Flow States
  const [isAddingCaretaker, setIsAddingCaretaker] = useState(false);
  const [caretakerStep, setCaretakerStep] = useState<'PHONE' | 'OTP' | 'SUCCESS'>('PHONE');
  const [caretakerPhone, setCaretakerPhone] = useState('');
  const [caretakerOtp, setCaretakerOtp] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.includes(searchQuery)
  );

  const handleCaretakerPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caretakerPhone.length >= 8) {
      setCaretakerStep('OTP');
    }
  };

  const handleCaretakerOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caretakerOtp.length === 4) {
      setCaretakerStep('SUCCESS');
    }
  };

  const resetCaretakerFlow = () => {
    setIsAddingCaretaker(false);
    setCaretakerStep('PHONE');
    setCaretakerPhone('');
    setCaretakerOtp('');
    setShowCountryPicker(false);
  };

  return (
    <div className="space-y-6 relative">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome, {user.name}</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium">Your Nivra Band is synced and monitoring your health vitals.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Device Status" icon={<Bluetooth className="w-5 h-5" />} className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/50 rounded-3xl text-center border border-slate-100 dark:border-zinc-800/50 transition-all hover:shadow-inner group">
              <Battery className={`w-7 h-7 mx-auto mb-3 transition-transform group-hover:scale-110 ${device.battery > 20 ? 'text-emerald-500' : 'text-rose-500'}`} />
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{device.battery}%</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase font-black tracking-widest mt-1">Battery</p>
            </div>
            <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/50 rounded-3xl text-center border border-slate-100 dark:border-zinc-800/50 transition-all hover:shadow-inner group">
              <Heart className="w-7 h-7 mx-auto mb-3 text-rose-500 transition-transform group-hover:scale-110" />
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{device.heartRate}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase font-black tracking-widest mt-1">BPM</p>
            </div>
            <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/50 rounded-3xl text-center border border-slate-100 dark:border-zinc-800/50 transition-all hover:shadow-inner group">
              <Wind className="w-7 h-7 mx-auto mb-3 text-indigo-500 transition-transform group-hover:scale-110" />
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{device.spo2}%</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase font-black tracking-widest mt-1">SpO₂</p>
            </div>
            <div className="p-5 bg-slate-50/50 dark:bg-zinc-900/50 rounded-3xl text-center border border-slate-100 dark:border-zinc-800/50 transition-all hover:shadow-inner group">
              <Zap className="w-7 h-7 mx-auto mb-3 text-orange-500 transition-transform group-hover:scale-110" />
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{device.hrv}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase font-black tracking-widest mt-1">HRV (ms)</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Attack History" icon={<Calendar className="w-5 h-5" />}>
          <div className="space-y-4">
            {mockHistory.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-zinc-900 rounded-3xl bg-white dark:bg-black/20">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${log.severity === 'Severe' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-zinc-200">{log.severity} Seizure</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">{log.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-indigo-500">{log.duration}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-indigo-500 text-sm font-black hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all">View All Records</button>
          </div>
        </DashboardCard>

        <DashboardCard title="Quick Actions" icon={<UserPlus className="w-5 h-5" />}>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsAddingCaretaker(true)}
              className="flex flex-col items-center justify-center p-5 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 rounded-3xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-100/50 dark:border-transparent group"
            >
              <UserPlus className="w-8 h-8 mb-2 transition-transform group-hover:rotate-12" />
              <span className="text-xs font-black">Add Caretaker</span>
            </button>
            <button className="flex flex-col items-center justify-center p-5 bg-rose-50/50 dark:bg-rose-500/10 text-rose-600 rounded-3xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-100/50 dark:border-transparent group">
              <Clock className="w-8 h-8 mb-2 transition-transform group-hover:-rotate-12" />
              <span className="text-xs font-black">Log Meds</span>
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Add Caretaker Overlay */}
      {isAddingCaretaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 dark:bg-black/20 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-zinc-800 p-8 relative overflow-hidden">
            <button 
              onClick={resetCaretakerFlow}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            {caretakerStep === 'PHONE' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white">Add Caretaker</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2">Enter your caretaker's mobile number to send an invitation.</p>
                </div>

                <form onSubmit={handleCaretakerPhoneSubmit} className="space-y-6">
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryPicker(true)}
                        className="h-full flex items-center justify-center gap-2 px-4 py-4 bg-slate-50 dark:bg-zinc-900 border-2 border-transparent hover:border-slate-200 dark:hover:border-zinc-800 rounded-2xl transition-all font-bold dark:text-white whitespace-nowrap"
                      >
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </button>
                    </div>
                    <div className="relative flex-1">
                      <input 
                        type="tel"
                        placeholder="Caretaker phone"
                        value={caretakerPhone}
                        onChange={e => setCaretakerPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-zinc-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all outline-none font-medium dark:text-white"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-600 transition-all active:scale-[0.98]"
                  >
                    Send Invite
                  </button>
                </form>

                {showCountryPicker && (
                  <div className="absolute inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg dark:text-white">Select Country</h3>
                      <button onClick={() => setShowCountryPicker(false)} className="text-indigo-500 font-bold">Close</button>
                    </div>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm dark:text-white"
                        autoFocus
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                      {filteredCountries.map(country => (
                        <button
                          key={country.iso}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryPicker(false);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                            selectedCountry.iso === country.iso 
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' 
                              : 'hover:bg-slate-50 dark:hover:bg-zinc-900 dark:text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{country.flag}</span>
                            <span className="font-medium">{country.name}</span>
                          </div>
                          <span className="text-xs font-bold opacity-60">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {caretakerStep === 'OTP' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white">Verify Caretaker</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2">
                    Enter the code sent to <span className="font-bold text-indigo-500">{selectedCountry.code} {caretakerPhone}</span>
                  </p>
                </div>

                <form onSubmit={handleCaretakerOtpSubmit} className="space-y-6">
                  <input 
                    type="text"
                    maxLength={4}
                    value={caretakerOtp}
                    onChange={e => setCaretakerOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center py-4 bg-slate-50 dark:bg-zinc-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl transition-all outline-none text-2xl font-black tracking-[1rem] pl-4 dark:text-white"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-[0.98]"
                  >
                    Verify & Link
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCaretakerStep('PHONE')}
                    className="w-full text-sm font-bold text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    Change Number
                  </button>
                </form>
              </div>
            )}

            {caretakerStep === 'SUCCESS' && (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white">Successfully Linked!</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2 px-4">
                    Your caretaker has been added. They will now receive real-time alerts and updates.
                  </p>
                </div>
                <button 
                  onClick={resetCaretakerFlow}
                  className="w-full py-4 bg-slate-900 dark:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl transition-all active:scale-[0.98]"
                >
                  Awesome
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
