import { Book } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { bookService } from '../services/api';

export default function Navbar() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await bookService.syncData();
      alert('Data synced successfully!');
      window.location.reload(); 
    } catch (err) {
      alert('Failed to sync. Is backend running?');
    }
    setSyncing(false);
  };

  const navClass = ({ isActive }) => 
    `text-sm font-semibold transition-all py-2 px-4 rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`;

  return (
    <nav className="backdrop-blur-xl bg-white/70 shadow-sm border-b border-indigo-100/50 sticky top-0 z-50 font-medium">
      <div className="w-full max-w-6xl mx-auto px-4 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <NavLink to="/" className="font-extrabold text-2xl flex items-center gap-2 tracking-tight group">
             <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                <Book className="text-white w-5 h-5 flex-shrink-0" />
             </div>
             <span className="text-slate-800">Book<span className="text-indigo-600">Insight</span></span>
          </NavLink>
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" className={navClass}>Dashboard</NavLink>
            <NavLink to="/qa" className={navClass}>AI Chat</NavLink>
          </div>
        </div>
        
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-6 py-2.5 text-sm bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all duration-300 hover:scale-[1.03] active:scale-95">
          {syncing ? (
            <span className="flex items-center gap-2"><span className="animate-spin text-lg block">⏳</span> Syncing...</span>
          ) : '🔄 Sync Library'}
        </button>
      </div>
    </nav>
  );
}
