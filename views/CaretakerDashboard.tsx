
import React, { useState } from 'react';
import { User } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Phone, Heart, AlertCircle, MessageSquare, History, X, Plus } from 'lucide-react';

interface Note {
  id: string;
  timestamp: string;
  text: string;
}

const CaretakerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', timestamp: 'Today, 08:30 AM', text: 'Medication taken: Valproate 500mg' },
    { id: '2', timestamp: 'Yesterday, 11:45 PM', text: 'Sleep tracking active - Normal rhythms' },
  ]);

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateLabel = now.toDateString() === new Date().toDateString() ? 'Today' : now.toLocaleDateString();

    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: `${dateLabel}, ${timestamp}`,
      text: newNoteText,
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Hello, {user.name}</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Monitoring Patient: <span className="font-bold text-indigo-500">Osman Ghani</span></p>
      </header>

      <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">Osman is Safe</p>
              <p className="text-white/70 text-sm">Last sync: 2 mins ago</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold border border-white/30 uppercase tracking-wide">
            Live
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 transition-all hover:bg-white/20">
            <p className="text-white/60 text-[10px] uppercase font-bold mb-1">Current Heart Rate</p>
            <p className="text-2xl font-black">74 <span className="text-sm font-normal text-white/60">BPM</span></p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 transition-all hover:bg-white/20">
            <p className="text-white/60 text-[10px] uppercase font-bold mb-1">Oxygen (SpO₂)</p>
            <p className="text-2xl font-black">98 <span className="text-sm font-normal text-white/60">%</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Emergency Actions" icon={<AlertCircle className="w-5 h-5" />}>
          <div className="space-y-3">
            <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]">
              <Phone className="w-5 h-5" /> Call Emergency Services
            </button>
            <p className="text-center text-[10px] text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-widest mt-2">
              Calling will notify all linked caretakers
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Caretaker Log" icon={<History className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {notes.map(note => (
                <div key={note.id} className="p-3 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800 transition-all hover:border-indigo-200 dark:hover:border-indigo-500/30">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">{note.timestamp}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{note.text}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsAddingNote(true)}
              className="w-full py-3 text-indigo-500 text-sm font-black mt-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Note
            </button>
          </div>
        </DashboardCard>
      </div>

      <div className="fixed bottom-6 right-6 z-30">
        <button className="w-16 h-16 bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-indigo-500/40">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Add Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 dark:bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-zinc-800 p-8 relative overflow-hidden">
            <button 
              onClick={() => setIsAddingNote(false)}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black dark:text-white">Add Log Note</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2">Record observations or medication details for the patient history.</p>
            </div>

            <form onSubmit={handleAddNote} className="space-y-6">
              <textarea 
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder="Type your note here..."
                className="w-full h-32 px-5 py-4 bg-slate-50 dark:bg-zinc-900 border-2 border-transparent focus:border-indigo-500 rounded-3xl transition-all outline-none font-medium dark:text-white resize-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 rounded-2xl font-bold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="flex-2 py-4 px-8 bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaretakerDashboard;
