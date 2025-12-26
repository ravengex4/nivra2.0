
import React, { useState } from 'react';
import { User, MedicalRecord } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Smartphone, Search, FileText, Download, Share2, Plus, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockPatientRecord: MedicalRecord = {
  id: 'rec1',
  patientId: 'p1',
  diagnoses: ['Idiopathic Generalized Epilepsy', 'Absence Seizures'],
  medications: [
    { name: 'Levetiracetam', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Lamotrigine', dosage: '100mg', frequency: 'Once daily' }
  ],
  scans: [
    { type: 'MRI Brain', url: '#', date: '2023-05-12' },
    { type: 'EEG 24hr', url: '#', date: '2023-08-01' }
  ]
};

const analyticsData = [
  { month: 'May', seizures: 4 },
  { month: 'Jun', seizures: 2 },
  { month: 'Jul', seizures: 5 },
  { month: 'Aug', seizures: 1 },
  { month: 'Sep', seizures: 0 },
  { month: 'Oct', seizures: 2 },
];

const DoctorDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activePatient, setActivePatient] = useState<MedicalRecord | null>(null);
  const [scanning, setScanning] = useState(false);

  const simulateNFC = () => {
    setScanning(true);
    setTimeout(() => {
      setActivePatient(mockPatientRecord);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight text-shadow">Welcome, Dr. {user.name}</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Tap phone on Smart Band NFC to read patient records.</p>
      </header>

      {!activePatient && (
        <div className="flex flex-col items-center justify-center py-20 px-6 glass rounded-3xl border-dashed border-2 border-indigo-200 dark:border-zinc-800 bg-white/50 dark:bg-black">
          <div className={`p-6 rounded-full ${scanning ? 'bg-indigo-500 animate-ping' : 'bg-indigo-50 dark:bg-zinc-900'}`}>
            <Smartphone className={`w-12 h-12 ${scanning ? 'text-white' : 'text-indigo-500'}`} />
          </div>
          <h3 className="mt-8 text-xl font-bold dark:text-zinc-100">Ready to Scan</h3>
          <p className="text-slate-500 dark:text-zinc-500 text-center mt-2 max-w-xs">
            Ask the patient to bring their Nivra band close to your device.
          </p>
          <button 
            onClick={simulateNFC}
            disabled={scanning}
            className="mt-6 px-8 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-600 transition-all disabled:opacity-50 active:scale-95"
          >
            {scanning ? 'Scanning...' : 'Scan Now (Simulation)'}
          </button>
        </div>
      )}

      {activePatient && (
        <div className="animate-in slide-in-from-bottom-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg">O</div>
              <div>
                <h3 className="font-bold text-lg dark:text-zinc-100">Osman Ghani</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Male • 28 years • O+ Blood</p>
              </div>
            </div>
            <button onClick={() => setActivePatient(null)} className="text-indigo-500 font-bold text-sm hover:underline">Close Record</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Medical Overview" icon={<FileText className="w-5 h-5" />}>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-600 mb-1 tracking-widest">Active Diagnoses</p>
                  <div className="flex flex-wrap gap-2">
                    {activePatient.diagnoses.map(d => (
                      <span key={d} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-500/20">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-600 mb-1 tracking-widest">Medication History</p>
                  <div className="space-y-2">
                    {activePatient.medications.map(m => (
                      <div key={m.name} className="p-3 bg-slate-50 dark:bg-zinc-900/50 rounded-xl flex justify-between border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 transition-all">
                        <div>
                          <p className="text-sm font-bold dark:text-zinc-200">{m.name}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-500">{m.frequency}</p>
                        </div>
                        <p className="text-xs font-bold text-indigo-500">{m.dosage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Frequency Analytics" icon={<ArrowRight className="w-5 h-5" />}>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" className="hidden dark:block" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(99,102,241,0.05)'}} 
                      contentStyle={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                      itemStyle={{color: '#6366f1', fontWeight: 'bold'}}
                    />
                    <Bar dataKey="seizures" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="p-4 bg-white/50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all group">
              <Download className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold dark:text-zinc-300">Export PDF</span>
            </button>
            <button className="p-4 bg-white/50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all group">
              <Share2 className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold dark:text-zinc-300">Referral</span>
            </button>
            <button className="p-4 bg-white/50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all group">
              <Plus className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold dark:text-zinc-300">Add Scan</span>
            </button>
            <button className="p-4 bg-white/50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all group">
              <Search className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold dark:text-zinc-300">Full Logs</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
