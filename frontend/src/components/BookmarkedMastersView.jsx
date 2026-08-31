import React from 'react';
import { Bookmark, ExternalLink, GraduationCap, MapPin, Building2, Calendar, Trash2 } from 'lucide-react';

export default function BookmarkedMastersView({ savedPrograms, onToggleBookmark }) {
  if (!savedPrograms || savedPrograms.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
        <div className="p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 w-16 h-16 mx-auto flex items-center justify-center">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">No Bookmarked Masters Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the star / bookmark icon on any Master program card to save it here for fast application access!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" /> Bookmarked Masters ({savedPrograms.length})
          </h2>
          <p className="text-xs text-slate-400">Your saved Master degree opportunities for English Studies</p>
        </div>
      </div>

      {/* Bookmarked Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 hover:border-amber-500/50 transition shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {prog.city}
                </span>

                <button
                  onClick={() => onToggleBookmark(prog)}
                  className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition cursor-pointer"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-white text-base leading-snug">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" /> {prog.university}
                </p>
              </div>

              {prog.deadline && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" /> Deadline: {prog.deadline}
                </div>
              )}

            </div>

            <div className="pt-3 border-t border-slate-800">
              <a
                href={prog.portal_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Launch Official Notice / Inscription <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
