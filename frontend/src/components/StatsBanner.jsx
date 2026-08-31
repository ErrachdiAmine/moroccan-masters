import React from 'react';
import { Globe, Clock, Bookmark } from 'lucide-react';

export default function StatsBanner({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Total Open Master's</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.total_programs || 0}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across Moroccan Faculties</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
          <Globe className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Closing Soon (&le; 15 Days)</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats?.closing_soon || 0}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Urgent Pre-registrations</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">My Bookmarks</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.saved_count || 0}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Saved Master Degrees</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
          <Bookmark className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
